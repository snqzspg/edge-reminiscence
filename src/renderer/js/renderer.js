const fixedge = require('../fixedge.js');
const info = require('../information.js');

var statusManager = new StatusManager();
var expandEffectManager = new ExpandCardEffect();
var modal = new ModalBox();
function isFx(fx){
	return fx && {}.toString.call(fx) === '[object Function]';
}

function logStatus(message, type){
	switch (type) {
		case "success": 
			statusManager.informSuccess(message);
			break;
		case "warning": 
			statusManager.warn(message);
			break;
		case "error": 
			statusManager.criticalWarn(message);
			break;
		default:
			statusManager.inform(message);
	}
}

function clickTile(){
	this.querySelector(".action .read-more").click();
}

function fixOldEdge(event, callback){
	event.stopPropagation();
	fixedge.fixEdgeLegacy(function(){if (isFx(callback)) {callback();} checkEdgeStatus();}, logStatus, articleStatInfoLog);
}

function fixOldEdgeInfo(tile){
	expandEffectManager.expand(tile, modal, info.fixEdge);
}

function tryLaunchEdge(event, callback){
	event.stopPropagation();
	fixedge.tryLaunchEdge(callback);
}

function tryLaunchEdgeInfo(tile){
	expandEffectManager.expand(tile, modal, info.launchEdge);
}

function restoreNewEdge(event, callback){
	event.stopPropagation();
	fixedge.restoreDefaultBehaviour(function(){if (isFx(callback)) {callback();} checkEdgeStatus();}, logStatus, articleStatInfoLog);
}

function uninstallNewEdge(callback){
	fixedge.tryUninstallChromiumEdge(function(){if (isFx(callback)) {callback();} checkEdgeStatus();}, logStatus);
}

function uninstallNewEdgeInfo(tile){
	expandEffectManager.expand(tile, modal, info.uninstallEdge);
}

function uninstallNewEdgeWarning(event, tile){
	event.stopPropagation();
	expandEffectManager.expand(tile, modal, info.uninstallEdgeWarning, info.uninstallEdgeWarningAction, true);
	var modalChildren = modal.element.querySelectorAll("p");
	function clickFx(){
		var uninst = document.getElementById("proceedToUninst");
		if (uninst) {
			uninst.style.opacity = "1";
			uninst.style.pointerEvents = "";
		}
		console.log("Event");
		for (var i = 0; i < modalChildren.length; i++) {
			modalChildren[i].removeEventListener('click', clickFx);
		}
	}
	for (var i = 0; i < modalChildren.length; i++) {
		modalChildren[i].addEventListener('click', clickFx);
	}
	
}

function checkEdgeStatus(callback){
	function hideAllActionButtons(){
		document.getElementById("launch_button").style.display = "none";
		document.getElementById("unblock_button").style.display = "none";
		document.getElementById("revert_button").style.display = "none";
	}
	hideAllActionButtons();
	fixedge.checkUnblockStatus(function(hackActive){
		document.getElementById("launch_button").style.display = "inline-block";
		if (hackActive) {
			document.getElementById("unblock_button").style.display = "none";
			document.getElementById("revert_button").style.display = "inline-block";
		} else {
			document.getElementById("unblock_button").style.display = "inline-block";
			document.getElementById("revert_button").style.display = "none";
		}
		if (isFx(callback)) {callback();}
	}, hideAllActionButtons, hideAllActionButtons, logStatus);
}

function initStartup(){
	document.getElementById("placeholder_status").parentNode.removeChild(document.getElementById("placeholder_status"));
	logStatus("Checking Edge Legacy Installation...", "info");
	checkEdgeStatus();
	var tiles = document.getElementsByClassName("tile");
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].onclick = clickTile;
	}
}

function articleStatInfoLog(text){
	var StatInfo = document.getElementById("StatInfo");
	if (StatInfo) {
		while (StatInfo.firstChild) {
			StatInfo.removeChild(StatInfo.lastChild);
		}
		var em = document.createElement("strong");
		em.appendChild(document.createTextNode("Note"));
		StatInfo.appendChild(em);
		StatInfo.appendChild(document.createTextNode(": " + text));
	}
}
