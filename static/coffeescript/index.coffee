$ = require "./assets/javascript/jquery-2.1.3.min.js"
_ = require "underscore"
ipc = require 'ipc'
marked = require "marked"

$ () ->

  $("#markdown-input").keyup () ->
    content = $(this).val()
    compiled = marked content
    $('#preview').html compiled

  ipc.on 'saveFileRequest', (e, arg) ->
    content = $("#markdown-input").val()
    ipc.send 'saveFileResponse', content