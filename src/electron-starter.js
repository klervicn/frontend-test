const chokidar = require("chokidar");
const electron = require("electron");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const util = require("util");
const url = require("url");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Modify this path is you are on Linux
const watchPath = "public\\FHIR";
// promisify : to write all asynchrone operations in async await. Can await only promises returning functions, not callbacks
const readFile = util.promisify(fs.readFile);
let mainWindow;

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "/../build/index.html"),
    protocol: "file:",
    slashes: true
  });

function manageWindow(watcher) {
  mainWindow.on("closed", function() {
    // Stop watching folder
    watcher.close();
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function watchFolder(mainWindow) {
  // Watcher that ignore initial files (if not, initial files fire an add event on launch)
  const watcher = chokidar.watch(watchPath, {
    ignored: /(^|[\/\\])\.\../,
    persistent: true,
    ignoreInitial: true
  });

  watcher.on("add", async (filePath, stats) => {
    // Take only PDF files
    if (!filePath.endsWith(".pdf")) {
      mainWindow.webContents.send("error", {
        errorMessage: "Only PDF file is accepted"
      });
      return;
    }
    // Check file size
    if (stats.size / 1000000 > 2) {
      mainWindow.webContents.send("error", {
        errorMessage: "File cannot exceed 2 mb"
      });
      return;
    }
    try {
      // Take only filename to send it to react
      const filename = filePath.replace(/^.*[\\\/]/, "");
      const data = await readFile(filePath);
      await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
        method: "POST",
        body: data
      });
      // Find total number of binaries
      const fhirData = await fetch(
        "http://hapi.fhir.org/baseDstu3/Binary?_pretty=true&_summary=count"
      );
      const { total } = await fhirData.json();
      mainWindow.webContents.send("serverStateChanged", {
        filename,
        filesTotal: total
      });
    } catch (error) {
      mainWindow.webContents.send("error", { errorMessage: error.toString() });
      return;
    }
  });

  return watcher;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(startUrl);

  const watcher = watchFolder(mainWindow);
  manageWindow(watcher);
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
