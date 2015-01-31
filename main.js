var app = require('app');  // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require("menu");
var dialog = require('dialog');
var fs = require("fs");


//menu
var menuTemplate = [
    {
        label: "GM Editor",
        submenu: [
            {
                label: "About Atom Shell"
            },
            {
                label: "Hide All",
                accelerator: 'Command+H',
                selector: 'hide:'
            },
            {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Save",
                accelerator: 'Command+S',
                click: function () {
                    mainWindow.webContents.send("saveFileRequest");
                }
            },
            {
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:'
            }
        ]
    },
    {
        label: "Development",
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+Command+I',
                click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
            }
        ]
    }
];
var menu = Menu.buildFromTemplate(menuTemplate);

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 768, "frame": false});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    Menu.setApplicationMenu(menu); // Must be called within app.on('ready', function(){ ... });
});


app.on('window-all-closed', function() {
    app.quit();
});

app.on("activate-with-no-open-windows", function () {
    mainWindow.show();
});

ipc.on("window", function (event, arg) {
    if (arg == "close") {
        mainWindow.hide();
    } else if (arg == "maxium") {
        mainWindow.maximize();
    } else if (arg == "minus") {
        mainWindow.minimize();
    }
});

ipc.on("saveFileResponse", function (e, arg) {
    dialog.showSaveDialog(mainWindow, {
        "title": "Save Markdown File",
        "defaultPath": "~/Documents/untitled.md"
    }, function (path) {
        if (path) {
            fs.writeFile(path, arg, {"flag": "w+"}, function (e) {
                if (e) {
                    console.error(e);
                    return;
                }
                dialog.showMessageBox(mainWindow, {
                    "title": "Congratulations",
                    "message": "Save Completed!",
                    "buttons": ["OK"]
                })
            });
        }
    })
});




