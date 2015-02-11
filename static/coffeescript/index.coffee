$ = require "./bower_components/jquery/dist/jquery.min.js"
_ = require "underscore"
ipc = require 'ipc'
marked = require "marked"
fs = require 'fs'
hljs = require "highlight.js"
require "./bower_components/html2canvas/build/html2canvas.js"

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
    $('#preview').html compiled

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


  capture = () ->
    previewDom = $('#preview').get(0)
    window.html2canvas previewDom, {
      onrendered: (canvas) ->
        url = canvas.toDataURL()
        console.log url
    }

  ipc.on 'saveFileRequest', () ->
    content = $("#markdown-input").val()
    ipc.send 'saveFileResponse', content

  renderFromContent = (content) ->
    $('#markdown-input').val content
    compiled = marked content
    $('#preview').html compiled


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

