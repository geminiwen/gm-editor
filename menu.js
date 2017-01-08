let {Menu} = require("electron");
//menu
let menuTemplate = [
    {
        label: "GM Editor",
        submenu: [
            {
                label: "About GM Editor"
            },
            {
                type: 'separator'
            },
            {
                label: "Hide All",
                accelerator: 'CommandOrControl+H',
                selector: 'hide:'
            },
            {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            }
        ]
    },
    {
        label: "File",
        submenu: [
            {
                label: "Save",
                accelerator: 'CommandOrControl+S',
                click: function () {
                    mainWindow.webContents.send("saveFileRequest");
                }
            },
            {
                label: "Open..",
                accelerator: 'CommandOrControl+O',
                click: function () {
                    var homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                    var defaultPath =  path.join(homeDirectory, "Documents");
                    dialog.showOpenDialog(
                        mainWindow,
                        {
                            title: "Select File To Open",
                            defaultPath: defaultPath,
                            properties: ["openFile"],
                            filters: [
                                {
                                    name: "Markdown file",
                                    extensions: ["md", "markdown"]
                                }
                            ]
                        },
                        function (files) {
                            if (!files) {
                                return;
                            }
                            fs.readFile(files[0], {"encoding": "utf-8"}, function (err, data) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                mainWindow.webContents.send("openFile", data);
                            });
                        }
                    );
                    mainWindow.webContents.send("saveFileRequest");
                }
            }
        ]
    },
    {
        label: "Edit",
        submenu: [

            {
                label: 'Undo',
                accelerator: 'CommandOrControl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CommandOrControl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CommandOrControl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'CommandOrControl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CommandOrControl+A',
                selector: 'selectAll:'
            }
        ]
    },
    {
        label: "Development",
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+CommandOrControl+I',
                click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
            }
        ]
    }
];
var menu = Menu.buildFromTemplate(menuTemplate);