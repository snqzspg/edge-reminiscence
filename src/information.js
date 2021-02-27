var uninstallEdgeInfo = `<p>Normally when software gets installed it is possible to uninstall it.</p>
<p>Most people will find that the Microsoft Edge Chromium is suddenly installed on their computer without consent. However, unlike most other programs, this browser cannot be uninstalled via the standard means as Microsoft greyed out the uninstalled option on the Apps and Features list.</p><p>Fortunately, as the installation setup is pretty much similar to chromium's, uninstalling is still possible via the command line.</p><h3>Uninstalling via command line.</h3><p>The cmd command line to uninstall is the following:</p><blockquote class="codesnippet"><code style="word-break: break-all;">%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\[Version Number]\\Installer\\setup.exe -uninstall -system-level -verbose-logging</code></blockquote>
<p>for 64-bit Windows and the following:</p><blockquote class="codesnippet"><code style="word-break: break-all;">%ProgramFiles%\\Microsoft\\Edge\\Application\\[Version Number]\\Installer\\setup.exe -uninstall -system-level -verbose-logging</code></blockquote>
<p>for 32-bit Windows. Before running this you have to find out the version number of Edge installed on your system. You can run a dir command on the Edge Application directory to find it out. Example entering the following command for 64-bit (32-bit just remove '(x86)'):</p>
<blockquote class="codesnippet"><code style="word-break: break-all;">dir "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\"</code></blockquote>
<p>and you should get something like the following</p>
<blockquote class="codesnippet"><code style="word-break: break-all;">&nbsp;Volume&nbsp;in&nbsp;drive&nbsp;C&nbsp;is&nbsp;Windows<br>
&nbsp;Volume&nbsp;Serial&nbsp;Number&nbsp;is&nbsp;---------<br>
<br>
&nbsp;Directory&nbsp;of&nbsp;C:\\Program&nbsp;Files&nbsp;(x86)\\Microsoft\\Edge\\Application<br>
<br>
30/01/2021&nbsp;&nbsp;03:01&nbsp;AM&nbsp;&nbsp;&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<br>
30/01/2021&nbsp;&nbsp;03:01&nbsp;AM&nbsp;&nbsp;&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..<br>
30/01/2021&nbsp;&nbsp;03:00&nbsp;AM&nbsp;&nbsp;&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;88.0.705.56<br>
28/01/2021&nbsp;&nbsp;04:41&nbsp;PM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3,077,520&nbsp;msedge.exe<br>
30/01/2021&nbsp;&nbsp;03:00&nbsp;AM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;404&nbsp;msedge.VisualElementsManifest.xml<br>
28/01/2021&nbsp;&nbsp;04:42&nbsp;PM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;984,968&nbsp;msedge_proxy.exe<br>
28/01/2021&nbsp;&nbsp;04:41&nbsp;PM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;957,840&nbsp;pwahelper.exe<br>
30/01/2021&nbsp;&nbsp;03:01&nbsp;AM&nbsp;&nbsp;&nbsp;&nbsp;&lt;DIR&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SetupMetrics<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4&nbsp;File(s)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5,020,732&nbsp;bytes<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4&nbsp;Dir(s)&nbsp;&nbsp;&nbsp;*,***,***,***&nbsp;bytes&nbsp;free</code></blockquote>
<p>The version number is the one with numbers and dots, starts with 80+ or 90+ in the future. Replace [Version Number] in the uninstall command above with the number.</p>
<p>- The rest is to be written... -</p>`;
var uninstallEdgeAction = `<p id="proceedToUninst" style="text-align: center; transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1); pointer-events: none; opacity: 0;"><button type="button" onclick="uninstallNewEdge();">I've read and understood what I am doing and I'm doing so anyways</button></p>`;

module.exports = {
	launchEdge: `<h2>Try Launching Edge Legacy</h2>
	<p>This action will use a command line to launch Microsoft Edge Legacy. By default, with Edge Chromium installed, this will launch Edge Chromium.</p>
	<p><button type="button" onclick="tryLaunchEdge(event);">Launch Microsoft Edge Legacy</button></p>
	<p>When the new Microsoft Edge Chromium is installed in Windows 10, it replaces the old edge (which we refer to as Microsoft Edge Legacy or Edge Legacy) as the new system browser. However, the Microsoft Edge Legacy is not removed from the system, it is merely hidden by Edge Chromium. This is true as of Windows 10 update 20H2.</p>
	<p>It is possible to find Edge Legacy by opening <code>shell:AppsFolder</code>. However, Edge Chromium will force Edge Legacy to launch Edge Chromium by default.</p>
	<p>It is possible to launch Edge Legacy by editing the registry, which this app can do automatically for you. In summary, you need to delete the <code>BrowserReplacement</code> value in <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}</code> for 32-bit system or <code>HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}</code> for 64-bit system. Check out the Fix Edge Legacy card for more details.</p>
	<h3>Launching a UWP app using command line</h3>
	<p>For most people who are familiar with the command line, opening a win32 should be pretty straight forward, just type in the executable file path into the command line and it will open the applicaion (or program). Win32 has been the standard for Windows programs or now called apps since the introduction of Windows itself as an operating system. However, Windows 10 introduces a new app platform called Universal Windows Platform (<strong>UWP</strong>) [also known as (aka) Windows Store Apps]. UWP apps has a very different app interface compared to win32 apps or programs. While the executable of the UWP apps can be found if searched deep enough (Located in <code>%ProgramFiles%\\WindowsApps</code>), opening the executable does not do anything.</p>
	<p>Microsoft Edge Legacy is a UWP app and cannot be launched like a Win32 app. Instead, on the command line, it has to be launched via Windows Explorer.</p>
	<p>The command to Launch Microsoft Edge Legacy is</p>
	<blockquote class="codesnippet"><code style="word-break: break-all;">explorer.exe shell:AppsFolder\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge</code></blockquote>
	<p>Some may be asking how I got the command to launch Microsoft Edge Legacy, or how to get the command to launch my favourite UWP app, as there are a lot of random letters and numbers. To find the command simply enter <code>shell:AppsFolder</code> in the Run dialog <code>Win + R</code> and find your UWP application, right click and click Create Shortcut. It will tell you that it cannot create a shortcut here and ask you to put it on the Desktop instead. Click Yes and go to the Desktop, open the shortcut and click Properties. Here, the Target is part of the command you need. You just need follow this format</p>
	<blockquote class="codesnippet"><code style="word-break: break-all;">explorer.exe shell:AppsFolder\\[Target from shortcut]</code></blockquote>
	<p>Alas, the target is greyed out, means you cannot copy it directly. However, if the target name is short enough you can manually type the target into the command line. If the target is too long, you'll have to follow the steps in the next section.</p>
	<h3>How the command structure works?</h3>
	<p>The command launches the Windows Explorer with the arguments</p>
	<blockquote class="codesnippet"><code style="word-break: break-all;">shell:AppsFolder\\[PackageFamilyName]![App ID]</code></blockquote>
	<p>Windows Explorer has a lot of "shell" commands that are binded to certain folders that are deep into the drive or hidden by default on explorer. The AppsFolder command opens a window which lists all the apps in the start menu (including UWP ones). There are other shell commands like <code>shell:Startup</code>, which you should check as all the shortcuts in this folder will be run when Windows starts up.</p>
	<p>To launch a UWP app, you'll need two information about the app, the PackageFamilyName and the App ID. To access the PackageFamilyName, you'll need to use PowerShell and run <code>Get-AppxPackage</code>. You can add the name or part of the app name with two asterisks like <code>*Appname*</code> to filter the list. For example to get the Microsoft Edge Legacy PackageFamilyName, you'll type into PowerShell</p>
	<blockquote class="codesnippet"><code style="word-break: break-all;">Get-AppxPackage *edge*</code></blockquote>
	<p>And you'll get something like</p>
	<blockquote class="codesnippet"><code style="word-break: break-all;">Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;Microsoft.MicrosoftEdge<br>
Publisher&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;CN=Microsoft&nbsp;Corporation,&nbsp;O=Microsoft&nbsp;Corporation,&nbsp;L=Redmond,&nbsp;S=Washington,&nbsp;C=US<br>
Architecture&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;Neutral<br>
ResourceId&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:<br>
Version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;44.19041.423.0<br>
PackageFullName&nbsp;&nbsp;&nbsp;:&nbsp;Microsoft.MicrosoftEdge_44.19041.423.0_neutral__8wekyb3d8bbwe<br>
InstallLocation&nbsp;&nbsp;&nbsp;:&nbsp;C:\\Windows\\SystemApps\\Microsoft.MicrosoftEdge_8wekyb3d8bbwe<br>
IsFramework&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;False<br>
PackageFamilyName&nbsp;:&nbsp;Microsoft.MicrosoftEdge_8wekyb3d8bbwe<br>
PublisherId&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;8wekyb3d8bbwe<br>
IsResourcePackage&nbsp;:&nbsp;False<br>
IsBundle&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;False<br>
IsDevelopmentMode&nbsp;:&nbsp;False<br>
NonRemovable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;True<br>
IsPartiallyStaged&nbsp;:&nbsp;False<br>
SignatureKind&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;System<br>
Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;Ok</code></blockquote>
<p>- The rest is to be written... -</p>`,
	fixEdge: `<h2>Fix Edge Legacy</h2>
	<p>This action will attempt to allow launching of Microsoft Edge Legacy by modifying a registry setting in Edge Chromium.</p>
	<p><strong>Note</strong>: When Microsoft Edge Chromium updates it will undo this. You will have to unblock again should that happens.</p>
	<p><strong>Note</strong>: If you pin Microsoft Edge Legacy after successfully launching it, every time the Windows Explorer restarts it will turn into Microsoft Edge Chromium. Just unpin the extra Edge Chromium and re-launch Microsoft Edge Legacy again.</p>
	<p id="StatInfo"></p>
	<p><button type="button" onclick="fixOldEdge(event);">Unblock</button> <button type="button" onclick="restoreNewEdge(event);">Revert</button></p>
	<h3>Modifying the Registry</h3>
	<p>Edge Chromium has a registry value that determines whether Edge Chromium should "replace" the Edge Legacy. The value is <code>BrowserReplacement</code>, located in the key <code>Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\ClientState\\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}</code>. Edge Chromium will check for the presence of the BrowserReplacement value in the key (the data value does not matter) and if it's present, the Microsoft Edge Chromium will force Edge Legacy to launch Edge Chromium.</p>
	<p>In order to allow Edge Legacy to be launched, the <code>BrowserReplacement</code> value needs to be deleted.</p>
	<p>To restore the normal behaviour of Edge Chromium, simply add a new DWORD value in the key above and name it <code>BrowserReplacement</code>, with data being set to 1.</p>
	<p>However, everytime the Edge Chromium installer is run, the <code>BrowserReplacement</code> value will get added in automatically. This means that you have to delete the value again to launch Edge Legacy.</p>
	<p>Although Microsoft strongly recommends against this, there doesn't seem to be any permanent damage on the system.</p>
	<blockquote class="microsoft-info"><p style="font-weight: bold;">Important</p><p>This key is over-written every time the Microsoft Edge Stable channel is updated. As a best practice, we recommend that you DO NOT delete this key to allow users to access both versions of Microsoft Edge.</p></blockquote>
	<p>Source: <a href="https://docs.microsoft.com/en-us/deployedge/microsoft-edge-sysupdate-access-old-edge" target="_blank">https://docs.microsoft.com/en-us/deployedge/microsoft-edge-sysupdate-access-old-edge</a></p>
	<p>- The rest is to be written... -</p>`,
	uninstallEdge: `<h2>Uninstall Edge Chromium</h2>
	<p>This will uninstall Microsoft Edge Chromium by fetching the uninstall command from the EdgeUpdate registry.</p>
	<p><strong>Warning:</strong> If you are using Windows 10 20H2 update and later Edge Chromium is integrated in the system. While uninstalling Edge Chromium is possible, it could cause damage to the system or affect system functionality.</p>` + uninstallEdgeInfo,
	uninstallEdgeWarning: `<h2>Warning</h2>
	<p>If you are using Windows 10 20H2 update and later Edge Chromium is integrated in the system. While uninstalling Edge Chromium is possible, it could cause damage to the system or affect system functionality.</p><p>Uninstalling may not be possible on 21H1 systems as Microsoft may be removing Microsoft Edge Legacy from the system.</p>` + uninstallEdgeAction,
	uninstallEdgeWarningAction: `<p style="text-align: center;"><button type="button" onclick="expandEffectManager.contract();">TL;DR I have no idea what this is</button></p>`
};
