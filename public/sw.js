// public/sw.js

// Tangkap event Push Notification dari HP
self.addEventListener('push', (event) => {
  let data = {
    title: 'Pengingat Latihan Natal GKPI! 🔔',
    body: 'Ada latihan hari ini, jangan sampai terlambat ya!',
    icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
    url: '/'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'gkpi-natal-reminder',
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ketika notifikasi di HP diklik oleh user
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});