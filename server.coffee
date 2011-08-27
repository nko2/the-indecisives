nko = require('nko')('L3U8N469dCVshmal')
express = require('express')

app = express.createServer()
app.use(express.compiler(src: "#{__dirname}/src", dest: "#{__dirname}/public", enable: ['coffeescript', 'less']))
app.use(express.static("#{__dirname}/public"))
app.listen(80)
