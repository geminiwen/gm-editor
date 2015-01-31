$ = require "./assets/javascript/jquery-2.1.3.min.js"
_ = require "underscore"
marked = require "marked"

inputEvent = _.throttle(() ->
    input = $('#markdown-input').val()

    $("#preview").text input

, 100)

$ () ->
  $("#markdown-input").on "keyup", () ->
    content = $(this).val()
    compiled = marked content
    $('#preview').html compiled