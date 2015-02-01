$ = require "./assets/javascript/jquery-2.1.3.min.js"
_ = require "underscore"
ipc = require 'ipc'
marked = require "marked"
fs = require 'fs'

$ () ->

  $("#markdown-input").keyup () ->
    content = $(this).val()
    compiled = marked content
    $('#preview').html compiled

  ipc.on 'saveFileRequest', (e, arg) ->
    content = $("#markdown-input").val()
    ipc.send 'saveFileResponse', content

  renderFromFile = (content) ->
    $('#markdown-input').text content
    compiled = marked content
    $('#preview').html compiled

  dragOver = () ->
    false

  bodyDom = document.getElementsByTagName("body")[0];
  bodyDom.ondragover = bodyDom.ondragend = dragOver

  bodyDom.ondrop = (e) ->
    e.preventDefault()
    file = e.dataTransfer.files[0]
    fs.readFile file.path, {"encoding": "utf-8"}, (err, data) ->
      if err
        console.error err
        return
      renderFromFile data

  ipc.on "openFile", (data) ->
#    console.log data
    renderFromFile data

