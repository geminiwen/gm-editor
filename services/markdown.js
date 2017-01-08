const {ipcMain, dialog} = require("electron");
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const path = require("path");

class Markdown {
    constructor(editor, hexo) {
        this.editor = editor;
        this.hexo = hexo;
        this.prepareEvents();
    }

    prepareEvents() {
        this.registerSaveFile();
        this.registerRender();
    }

    registerRender() {
        ipcMain.on("renderContentRequest", (event, content) => {
            this.hexo.render.render({text: content, engine: "markdown"})
                .then(function (content) {
                    console.log(content);
                    // event.sender.send("renderContentResponse", content);
                });
        });
    }

    registerSaveFile() {
        ipcMain.on("saveFileResponse", (event, content) => {
            let homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
            let defaultPath = path.join(homeDirectory, "Documents", "untitled.md");
            new Promise((resolve, reject) => {
                dialog.showSaveDialog(this.editor, {
                    "title": "Save Markdown File",
                    "defaultPath": defaultPath
                }, function (path) {
                    if (!path) {
                        reject("Empty File")
                    }
                    resolve({path, content});
                })
            })
            .then(({path, content}) => {
                return fs.writeFile(path, content, {"flag": "w+", "encoding": "utf-8"});
            })
            .then(() => {
                dialog.showMessageBox(this.editor, {
                    "title": "Congratulations",
                    "message": "Save Completed!",
                    "buttons": ["OK"]
                })
            })
            .catch(function (err) {
                if (err == "Empty File") return;
                console.error(err);
            });
        });
    }
}

module.exports = Markdown;