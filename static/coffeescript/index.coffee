$ = require "./assets/javascript/jquery-2.1.3.min.js"
_ = require "underscore"
ipc = require 'ipc'
marked = require "marked"
fs = require 'fs'
hljs = require "highlight.js"
CodeMirror = require "./assets/javascript/codemirror.min.js"

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

#  CodeMirror.fromTextArea $('#markdown-input').get(0), {
#    "mode": "gfm",
#    lineNumbers: true,
#    matchBrackets: true,
#    lineWrapping: true,
#    theme: 'default',
#
#  };

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
