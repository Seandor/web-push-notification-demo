self.addEventListener('notificationclose', event => {
  console.log('notification closed', event)
})

self.addEventListener('notificationclick', event => {
  console.log('notification clicked', event)
})


self.addEventListener('push', event => {
  const transaction = JSON.parse(event.data.text())
  const options = {
    body: transaction.business
  }

  const transactionType = transaction.type === 'deposit' ? '+' : '-'

  event.waitUntil(
    self.registration.showNotification(`${transactionType} ${transaction.amount}`, options)
  )
})