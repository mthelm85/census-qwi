const cors = require('cors'),
      express = require('express'),
      mongoClient = require('mongodb').MongoClient,
      serveStatic = require('serve-static'),
      path = require('path'),
      port = process.env.PORT || 3000,
      url = process.env.MONGODB_URI,
      app = express()

app.use(serveStatic(path.join(__dirname, '/dist')))
app.use(cors({
  origin: ['*'],
  methods: ['GET'],
  credentials: true
}))

mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err
  const db = client.db('heroku_g4wvr664')
  app.get('/county-fips', (req, res) => {
    db.collection('counties')
    .find()
    .toArray((err, docs) => {
      res.json({ counties: docs })
    })
  })
  app.listen(port)
})
