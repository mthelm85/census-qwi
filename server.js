const express = require('express'),
      serveStatic = require('serve-static'),
      path = require('path'),
      port = process.enc.PORT || 3000
      app = express()

app.use(serveStatic(path.join(__dirname, '/dist')))
app.listen(port)
