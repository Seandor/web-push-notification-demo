const webPush = require('web-push')
const faker = require('faker')

const pushSubscription = {
  "endpoint": "https://wns2-sg2p.notify.windows.com/w/?token=BQYAAAD0r9StbwKavEqvFb7UQatUBe1mSPFDMzy5mTjEUg8a9Y%2f5D%2bf24C0RvZIa6Frm7zMo8Cyl7Sa30bwYt0mLsm1%2fv9yfooBbkObege1aCV1VeMgJYIUtoob70%2fom8gR9wB%2bKT3WaJepNFLEItnx8yClvpHYIkYsWCGut6Pemqs7M5blNByD33%2bAguoLC95NcYbzFkN6d8CjiyGHp9l2N1wjPN6QyTqVJQjDJ%2fW31NesdOTbFF6J8vP79Dxu0HFLMVGJT3A7axPWUkmKb9t34g2%2bHcTe4gdgOISryZwulCQJJFySgaklSlbf87FOhWcNdaNjdO%2bS6Aw8gQ18XHSMpJHqs",
  "expirationTime": null,
  "keys": {
    "p256dh": "BGEWPK4nWNLEFIy13fsg4pU3s114nfOO-LJ6dhVl2vWppfxJUWddYGnRjHspolfaMZM0pqwZUYCjPQ-Un76aK0g",
    "auth": "VgtY0aYxUIjrr-IYT9bDBQ"
  }
}

const vapidPublicKey = 'BFbevN-wPyoqR3oGVejuGnWrbcEbDSNF4vgbL1nogAtSAD5ZcCkqku2jI-upqCu5_yc0j3vAEBjWk49hKzFP8ak'
const vapidPrivateKey = 'U0lA5heA6Vp9Oi4LjLS-DLZ1DatvcEbfBzVEsQW5Vok'

const options = {
  TTL: 60,
  vapidDetails: {
    subject: 'mailto: pusher@pushy.com',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
}

const notify = (subscribers) => {
  const transaction = faker.helpers.createTransaction()

  if (subscribers.size < 1) {
    console.log('No subscribers to notify')
    return
  }
  
  subscribers.forEach((subscriber, id) => {
    webPush.sendNotification(
      subscriber,
      JSON.stringify(transaction),
      options
    )
      .then(() => console.log(`${subscribers.size} subscribers notified`))
      .catch(error => console.error('Error in pushing notification', error))
  })
}

module.exports = {
  notify
}