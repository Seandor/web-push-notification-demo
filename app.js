const express = require('express')
const cors = require('cors')
const publisher = require('./server/publisher')

const app = express()
const port = 9999

app.use(express.json())

app.use(cors())

app.use(express.static(__dirname))

const subscribers = new Map()

app.post('/addSubscriber', function (req, res) {
  const pushSubscription = req.body
  const id = pushSubscription.keys.auth
  subscribers.set(id, pushSubscription)
  console.log(`New subscriber added. Total Subscribers: ${subscribers.size}`)
  res.send('OK!')
})

app.post('/removeSubscriber', function (req, res) {
  const id = req.body.id
  subscribers.delete(id)
  console.log(`Subscriber unsubscribed. Total subscribers: ${subscribers.size}`)
  res.send('OK!')
})

setInterval(() => {
  publisher.notify(subscribers)
}, 5000);

app.listen(port, () => {
  console.log(`Server app is running at http://localhost:${port}`)
})