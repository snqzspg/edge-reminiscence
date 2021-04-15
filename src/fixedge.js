const path = require('path');
const fs = require('fs');
const regedit = require('regedit');
const { exec } = require('child_process');
const { elevate } = require('node-windows');
const edgeRegistryKeyFull = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}';
const edgeRegistryKeyFull32bit = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}';
const edgeRegistrySubKey = 'HKLM\\SOFTWARE\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}';
const edgeRegistryWOW64SubKey = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}';
const edgeRegistryKey = 'HKLM\\SOFTWARE\\Microsoft\\EdgeUpdate';
const edgeRegistryWOW64Key = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate';
const msEdgeCommand = 'explorer shell:AppsFolder\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge';

function isFx(fx){
	return fx && {}.toString.call(fx) === '[object Function]';
}

function registryDoesNotExist(err, result){
	// Edge Chromium is not installed or the registry structure has changed.
}

function subkeyDoesNotExist(err, result){
	// Edge Chromium is not installed.
}

function registryStructureChanged(err, result){
	// The registry structure of this version of Edge Chromium has changed.
}

function checkKeyExists(callback, regnotexist, nosubkey, regstructurechanged){
	function nosubkeyerr(err, result){
		if (isFx(regnotexist)) {
			nosubkey(err, result);
		} else {
			subkeyDoesNotExist(err, result);
		}
	}

	function structchangeerr(err, result){
		if (isFx(regstructurechanged)) {
			regstructurechanged(err, result);
		} else {
			registryStructureChanged(err, result);
		}
	}
	var useWoW64Key = false;

	regedit.list(edgeRegistryKey, function(err, result){
		if (err) {
			regedit.list(edgeRegistryWOW64Key, function(err2, result2){
				if (err2) {
					if (isFx(regnotexist)) {
						regnotexist(err2, result2);
					} else {
						registryDoesNotExist(err2, result2);
					}
				} else if (!result2[edgeRegistryWOW64Key].keys) {
					useWoW64Key = true;
					nosubkeyerr(err2, result2);
				} else {
					useWoW64Key = true;
					regedit.list(edgeRegistryWOW64SubKey, function(err3, result3){
						if (err3) {
							console.log(err3);
							structchangeerr(err3, result3);
						} else {
							var values = result3[edgeRegistryWOW64SubKey].values;
							var hackActive = !values["BrowserReplacement"];
							if(isFx(callback)) callback(useWoW64Key, hackActive, values);
						}
					});
				}
			});
		} else if (!result[edgeRegistryKey].keys) {
			nosubkeyerr(err2, result2);
		} else {
			regedit.list(edgeRegistrySubKey, function(err2, result2){
				if (err2) {
					structchangeerr(err2, result2);
				} else {
					var values = result2[edgeRegistrySubKey].values;
					var hackActive = !values["BrowserReplacement"];
					if(isFx(callback)) callback(useWoW64Key, hackActive, values);
				}
			});
		}
	})
}

function checkLegacyEdgeInstall(exists, missing, error){
	exec("powershell Get-AppxPackage *MicrosoftEdge*", function(err, stdout, stderr){
		if (err) {
			if (isFx(error)) error(err, stdout, stderr);
		} else {
			var patt = /PackageFamilyName\W{0,}:\WMicrosoft.MicrosoftEdge_8wekyb3d8bbwe/g;
			if (patt.test(stdout)) {
				var installLocPatt = /InstallLocation\W{0,}:.{0,}Microsoft.MicrosoftEdge_8wekyb3d8bbwe/g;
				var installLoc = stdout.match(installLocPatt)[0].replace(/InstallLocation\W{0,}:\W/, "");
				if (fs.existsSync(path.join(installLoc, "MicrosoftEdge.exe"))) {
					if (isFx(exists)) exists(stdout);
				} else {
					if (isFx(missing)) missing(stdout);
				}
			} else {
				if (isFx(missing)) missing(stdout);
			}
		}
	});
}

function checkChromiumEdgeInstall(exists, missing, error){
	exec("powershell Get-AppxPackage *MicrosoftEdge*", function(err, stdout, stderr){
		if (err) {
			if (isFx(error)) error(err, stdout, stderr);
		} else {
			var patt = /PackageFamilyName\W{0,}:\W{0,}Microsoft.MicrosoftEdge.Stable_8wekyb3d8bbwe/g;
			if (patt.test(stdout)) {
				if (isFx(exists)) exists(stdout);
			} else {
				if (isFx(missing)) missing(stdout);
			}
		}
	});
}

module.exports = {
	/**
	 * Perform registry modification to allow launching of Microsoft Edge Legacy without removing Edge Chromium
	 */
	fixEdgeLegacy: function(callback, logFx, log2Fx){
		function appNotExist(){
			if (isFx(logFx)) logFx("Edge Chromium is not installed", "warning");
		}

		function regError(){
			if (isFx(logFx)) logFx("Error reading Edge Chromium Updater registry", "error");
		}

		function scanAppError(){
			if (isFx(logFx)) logFx("An error occured while checking your Edge Chromium installation.", "error");
		}

		checkKeyExists(function(useWoW64Key, hackActive){
			if (!hackActive) {
				// NOTE: Potential more permanant soultion -> https://docs.microsoft.com/en-us/deployedge/microsoft-edge-sysupdate-access-old-edge
				elevate("reg delete " + (useWoW64Key ? edgeRegistryKeyFull : edgeRegistryKeyFull32bit) + " /v BrowserReplacement /f", function(err, stdout, stderr){
					if (err) {
						console.error(err);
					}

					// the *entire* stdout and stderr (buffered)
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
					if (isFx(callback)) callback();
				});
			} else {
				// Your Microsoft Edge Legacy can be launched
				if (isFx(log2Fx)) log2Fx("Your Microsoft Edge Legacy can be launched, no modifications are necessary.");
			}
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		});
	},
	/**
	 * Reverses the modification done to enable launching of Microsoft Edge Legacy without removing Edge Chromium
	 */
	restoreDefaultBehaviour: function(callback, logFx, log2Fx){
		function appNotExist(){
			if (isFx(logFx)) logFx("Edge Chromium is not installed", "warning");
		}

		function regError(){
			if (isFx(logFx)) logFx("Error reading Edge Chromium Updater registry", "error");
		}

		function scanAppError(){
			if (isFx(logFx)) logFx("An error occured while checking your Edge Chromium installation.", "error");
		}

		checkKeyExists(function(useWoW64Key, hackActive){
			if (hackActive) {
				elevate("reg add " + (useWoW64Key ? edgeRegistryKeyFull : edgeRegistryKeyFull32bit) + " /v BrowserReplacement /t REG_DWORD /d 1", function(err, stdout, stderr){
					if (err) {
						console.error(err);
					}

					// the *entire* stdout and stderr (buffered)
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
					if (isFx(callback)) callback();
				});
			} else {
				// Your Microsoft Edge Legacy behaviour is default.
				if (isFx(log2Fx)) log2Fx("Your Microsoft Edge Legacy behaviour is default.");
			}
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		});
		
	},
	/**
	 * Attempts to launch Microsoft Edge Legacy. If Edge Chromium is installed it will open Edge Chromium by default.
	 */
	tryLaunchEdge: function(callback){
		exec(msEdgeCommand, function(err, stdout, stderr){
			if (err) {
				console.error(err);
			}

			// the *entire* stdout and stderr (buffered)
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			if (callback && {}.toString.call(callback) === '[object Function]') callback();
		});
	},
	tryUninstallChromiumEdge: function(callback, logFx){
		function appNotExist(){
			if (isFx(logFx)) logFx("Edge Chromium is not installed", "warning");
		}

		function regError(){
			if (isFx(logFx)) logFx("Error reading Edge Chromium Updater registry", "error");
		}

		function scanAppError(){
			if (isFx(logFx)) logFx("An error occured while checking your Edge Chromium installation.", "error");
		}

		// NOTE: Warn users about system level integration of Edge Chromium on Windows 10 20H2 systems before performing uninstall.
		checkKeyExists(function(useWoW64Key, hackActive, values){
			try {
				var uninstallCommand = "\"" + values["UninstallString"]["value"] + "\"" + values["UninstallArguments"]["value"];
				exec(uninstallCommand, function(err, stdout, stderr){
					if (err) {
						console.error(err);
						if (isFx(logFx)) logFx("Could not uninstall", "error");
					}

					// the *entire* stdout and stderr (buffered)
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
					if (callback && {}.toString.call(callback) === '[object Function]') callback();
				});
			} catch (err) {
				console.error(err);
				if (isFx(logFx)) logFx("Could not find uninstall command.", "error");
			}
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		}, function(err, result){
			checkChromiumEdgeInstall(function(){
				regError();
			}, function(){
				appNotExist();
			}, function(){
				scanAppError()
			});
		});
	},
	checkUnblockStatus: function(callback, logFx){
		function appNotExist(){
			if (isFx(logFx)) logFx("Edge Chromium is not installed", "warning");
		}

		function regError(){
			if (isFx(logFx)) logFx("Error reading Edge Chromium Updater registry", "error");
		}

		function scanAppError(){
			if (isFx(logFx)) logFx("An error occured while checking your Edge Chromium installation.", "error");
		}

		checkLegacyEdgeInstall(function(){
			checkKeyExists(function(useWoW64Key, hackActive, values){
				if (hackActive) {
					if (isFx(logFx)) logFx("Your Edge Legacy is unblocked.", "success");
				} else {
					if (isFx(logFx)) logFx("Your Edge Legacy is not unblocked.", "info");
				}
				if (isFx(callback)) callback(hackActive);
			}, function(err, result){
				checkChromiumEdgeInstall(function(){
					regError();
				}, function(){
					appNotExist();
				}, function(){
					scanAppError()
				});
			}, function(err, result){
				checkChromiumEdgeInstall(function(){
					regError();
				}, function(){
					appNotExist();
				}, function(){
					scanAppError()
				});
			}, function(err, result){
				checkChromiumEdgeInstall(function(){
					regError();
				}, function(){
					appNotExist();
				}, function(){
					scanAppError()
				});
			});
		}, function(){
			if (isFx(logFx)) logFx("Edge Legacy does not exist on your system.", "warning");
		}, function(){
			if (isFx(logFx)) logFx("An error occured while checking your Edge Legacy installation.", "error");
		});
		
	}
};
