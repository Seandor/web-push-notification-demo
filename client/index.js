const client = (() => {
  let serviceWorkerRegObj = null
  const notificationButton = document.getElementById("btn-notify")

  const showNotificationButton = () => {
    notificationButton.style.display = "block"
    notificationButton.addEventListener("click", showNotification)
  }

  const showNotification = () => {
    const simpleTextNotification = registration => registration.showNotification("My first notification")

    const customizedNotification = reg => {
      const options = {
        body: 'This is an important body',
        icon: 'images/favicon.png',
        actions: [
          { action: 'Search', title: 'Try Searching!' },
          { action: 'Close', title: 'Forget it!' },
        ]
      }
      reg.showNotification('Send Notification', options)
    }

    navigator.serviceWorker.getRegistration()
      .then(customizedNotification)
  }

  const checkNotificationSupport = () => {
    if (!('Notification') in window) {
      return Promise.reject("The browser doesn't support notifications")
    }
    console.log('The browser support Notifications!')
    return Promise.resolve("ok")
  }

  const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject("Service worker support is not available.")
    }
    return navigator.serviceWorker.register('service-worker.js')
      .then(regObj => {
        console.log("Service worker is registered successfully!")
        serviceWorkerRegObj = regObj
        showNotificationButton()
      })
  }

  const requestNotificationPermissions = ()=> {
    return Notification.requestPermission(status => {
      console.log("Notification permission status: ", status)
    })
  }

  checkNotificationSupport()
    .then(registerServiceWorker)
    .then(requestNotificationPermissions)
    .catch(err => console.error(err))
})()