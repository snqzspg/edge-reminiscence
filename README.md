# Edge Legacy Reminiscence
This is a electron-based GUI tool that enables you to open Microsoft Edge Legacy alongside the new Edge Chromium without uninstalling Edge Chromium. It does so by performing registry edits.
### Note
Microsoft ended its support on Edge Legacy on the 9th of March 2021, and removed Edge Legacy entirely on 13th of April 2021.

This tool modifies the registry by deleting BrowserReplacement value in the key
```
32-bit machines: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\EdgeUpdate\ClientState\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}
64-bit machines: HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\ClientState\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}
```
which is not recommended by Microsoft as stated [here](https://docs.microsoft.com/en-us/deployedge/microsoft-edge-sysupdate-access-old-edge#additional-information). Use this at your own risk!

## Legacy Edge Removal via Windows Update

Microsoft removed Edge Legacy via a "Patch Tuesday" update on 13th of April 2021 for Windows 10 1803, 1809, 1903, 1909, 2004 and 20H2 editions. More information by Microsoft [here](https://techcommunity.microsoft.com/t5/microsoft-365-blog/new-microsoft-edge-to-replace-microsoft-edge-legacy-with-april-s/ba-p/2114224).

## Release

The tool is incomplete and it will probably not be in time before the End of Support for Legacy Microsoft Edge. [You can get the release here](https://github.com/snqzspg/edge-reminiscence/releases/tag/v0.1.2)

Note that the release version is not signed (as that is not free), so it will be marked as an high-risk or potentially harmful application. Just allow this application to run and it will be good.

If you are uncomfortable with the release version, you can follow the steps below to compile your own application.

## Source files
This source files are build on [electron-forge](https://github.com/electron-userland/electron-forge) project by Electron Userland.

### Making a working application using the Source Code.

You will need to install [Node.js](https://nodejs.org/) Version 10 and above, as well as [Git](https://git-scm.com/).

You will also need `npm` or `yarn` installed.

Download the source files by cloning this repository.

Then open command line / terminal and navigate to the directory where you want the project to be. Enter the following command

```
npx create-electron-app edge-reminiscence
# or
yarn create electron-app edge-reminiscence
```
[Go to the electron-forge project for more details about installing electron-forge](https://github.com/electron-userland/electron-forge).

Go into the `edge-reminiscence` folder and delete the `src` and `package.json` in the folder. Copy the `src` and `package.json` from the clone into the folder.

Then `cd edge-reminiscence` and enter

```
npm start
```

to launch the application. 

If you want to compile the application as an executable, you can enter
```
npm run package
# or
npm run make
```

Then enter the `out` folder followed by the `Edge Legacy Reminiscence-win32-ia32` folder if you run `npm run package` or `make\zip\win32\ia32` folder if you run `npm run make`. Run the executable and the tool should be working.
