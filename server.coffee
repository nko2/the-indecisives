nko = require('nko')('L3U8N469dCVshmal')
express = require('express')
_ = require('underscore')

app = express.createServer()
app.use(express.compiler(src: "#{__dirname}/src", dest: "#{__dirname}/public", enable: ['coffeescript', 'less']))
app.use(express.static("#{__dirname}/public"))
app.listen(80)

console.log("listening on #{80}...")

io = require('socket.io').listen(app)
io.configure -> io.set('log level', 2)

game_loop = ->
  setTimeout ->
    console.log 'game_loop'
    # game_loop()
  , 1000 / 60

game_loop()

io.sockets.on 'connection', (socket) ->

  socket.on 'player:name', (name) ->

  socket.on 'player:update',  (action, callback) ->

  socket.on 'disconnect', ->
