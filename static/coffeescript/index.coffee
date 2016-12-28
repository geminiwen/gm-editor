$ = require "jquery"
_ = require "underscore"
ipc = require('electron').ipcRenderer
marked = require "marked"
fs = require 'fs'
hljs = require "highlight.js"
require "html2canvas"

$ () ->

  languageOverrides = {
    js: 'javascript',
    html: 'xml'
  }

  marked.setOptions {
    highlight: (code, lang) ->
      lang = languageOverrides[lang] ? lang
      if hljs.getLanguage(lang) then hljs.highlight(lang, code).value else code;
    gfm: true
    tables: true
    breaks: true
    pedantic: false
    sanitize: true
    smartLists: true
    smartypants: false
  }

  $("#markdown-input").keyup () ->
    content = $(this).val()
    compiled = marked content
    $('#preview-content').html compiled

  $('#markdown-input').keyup () ->
    content = $(this).val()
    localStorage.content = content

  $('.edit-mode').on "click", "a", () ->
    currentNode = $('.checked')
    oriMode = currentNode.data "mode"
    $('.checked').removeClass "checked"
    $(this).addClass "checked"
    mode = $(this).data "mode"

    $('.editor-frame').removeClass oriMode
                      .addClass mode
  # 截图
  capture = () ->
    previewDom = $('#preview-content').get(0)
    window.html2canvas previewDom
          .then (canvas) ->
            url = canvas.toDataURL()
            url = url.replace "data:image/png;base64,", ""
            ipc.send 'saveFileResponse', url


  ipc.on 'saveFileRequest', () ->
    content = $("#markdown-input").val()
    ipc.send 'saveFileResponse', content

  renderFromContent = (content) ->
    $('#markdown-input').val content
    compiled = marked content
    $('#preview-content').html compiled


  dragOver = () ->
    false

  bodyDom = $("body").get 0
  bodyDom.ondragover = bodyDom.ondragend = dragOver

  bodyDom.ondrop = (e) ->
    e.preventDefault()
    file = e.dataTransfer.files[0]
    fs.readFile file.path, {"encoding": "utf-8"}, (err, data) ->
      if err
        console.error err
        return
      renderFromContent data

  ipc.on "openFile", (data) ->
    renderFromContent data

  if localStorage.content
    content = localStorage.content
    renderFromContent content

