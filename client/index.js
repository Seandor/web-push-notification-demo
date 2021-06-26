const client = (() => {
  let serviceWorkerRegObj = null
  const notificationButton = document.getElementById("btn-notify")
  const pushButton = document.getElementById("btn-push")
  let isUserSubscribed = false

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

        return serviceWorkerRegObj.pushManager.getSubscription()
      })
      .then(subs => {
        if (subs) {
          disablePushNotificationButton()
        }
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

  const disablePushNotificationButton = () => {
    isUserSubscribed = true
    pushButton.innerText = "DISABLE PUSH NOTIFICATIONS"
    pushButton.style.backgroundColor = "#ea9085"
  }

  const enablePushNotificationButton = () => {
    isUserSubscribed = false
    pushButton.innerText = "ENABLE PUSH NOTIFICATIONS"
    pushButton.style.backgroundColor = "#efb1ff"
  }

  const setupPush = () => {

    function _urlBase64ToUnit8Array(url) {
      const padding = '='.repeat((4 - url.length % 4) % 4)
      const base64 = (url + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
      const binary_string = window.atob(base64);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes;
    }

    const subscribeWithServer = (subscription) => {
      return fetch('http://localhost:3000/addSubscriber', {
        method: 'Post',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const subscribeUser = () => {
      const appServerPublicKey = "BFbevN-wPyoqR3oGVejuGnWrbcEbDSNF4vgbL1nogAtSAD5ZcCkqku2jI-upqCu5_yc0j3vAEBjWk49hKzFP8ak"
      const publicKeyAsArray = _urlBase64ToUnit8Array(appServerPublicKey)

      serviceWorkerRegObj.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKeyAsArray
      })
      .then(subscription => {
        console.log(JSON.stringify(subscription, null, 2))
        subscribeWithServer(subscription)
        disablePushNotificationButton()
      })
      .catch(error => console.error("Failed to subscribe to Push service", error))
    }

    const unsubscribeWithServer = (id) => {
      return fetch('http://localhost:3000/removeSubscriber', {
        method: 'Post',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const unSubscribeUser = () => {
      serviceWorkerRegObj.pushManager.getSubscription()
        .then(subscription => {
          if (subscription) {
            let subAsString = JSON.stringify(subscription)
            let subAsObject = JSON.parse(subAsString)
            unsubscribeWithServer(subAsObject.keys.auth)
            return subscription.unsubscribe()
          }
        })
        .then(enablePushNotificationButton)
        .catch(error => console.error("Failed to unsubscribe from Push service", error))
    }

    pushButton.addEventListener('click', () => {
      if (isUserSubscribed) {
        unSubscribeUser()
      } else {
        subscribeUser()
      }
    })
  }

  setupPush()
})()