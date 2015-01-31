$ = require "../../../assets/javascript/jquery-2.1.3.min.js"
keyMap =
  '96': '`'
  '62': '>'
  '49': '1'
  '46': '.'
  '45': '-'
  '42': '*'
  '35': '#'
  '13': '\n'



class Compiler
  constructor : (@node) ->
    this.init()

  init: () ->
    @node = $ @node
    @stack = []

    $(@node).on "keypress", (e) =>
      @compile(e)

  compile: (e) ->
    code = e.which or e.code;

module.exports = Compiler