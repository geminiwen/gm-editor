const {ipcMain, dialog} = require("electron");
const fs = require("fs");
const path = require("path");

class Markdown {
    constructor(editor) {
        this.editor = editor;
        this.prepare();
    }
    
    prepare() {
        const editor = this.editor
        ipcMain.on("saveFileResponse", function (e, content) {
            var homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
            var defaultPath =  path.join(homeDirectory, "Documents", "untitled.md");
            dialog.showSaveDialog(editor, {
                "title": "Save Markdown File",
                "defaultPath": defaultPath
            }, function (path) {
                if (path) {
                    content = new Buffer(content);
                    fs.writeFile(path, content, {"flag": "w+", "encoding": "utf-8"}, function (e) {
                        if (e) {
                            console.error(e);
                            return;
                        }
                        dialog.showMessageBox(editor, {
                            "title": "Congratulations",
                            "message": "Save Completed!",
                            "buttons": ["OK"]
                        })
                    });
                }
            })
        });

    }
}

module.exports = Markdown;