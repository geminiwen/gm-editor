$ = require "jquery"
ipc = require('electron').ipcRenderer

$ () ->
  $ "#close-window"
  .click () ->
    ipc.sendSync "window", "close"

  $ "#maxium"
  .click () ->
    ipc.sendSync "window", "maxium"

  $ '#minus'
  .click () ->
    ipc.sendSync "window", "minus"