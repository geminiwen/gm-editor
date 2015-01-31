$ = require "./assets/javascript/jquery-2.1.3.min.js"
ipc = require 'ipc'

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