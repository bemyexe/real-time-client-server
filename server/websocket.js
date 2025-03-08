const ws = require('ws'); // импортриуем ws

const wss = new ws.Server(
  {
    port: 5000,
  },
  () => console.log(`Server started on 5000`)
); // создаем экземпляр сервера ws и прослушиваем 5000 порт

/**
 * подписываемся на событие connection, когда клиент подключается, будет вызываться функция-коллбэк, которая
 * принимает параметром ws объект, который представляет собой соединение с конкретным клиентом.
 * */
wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message':
        broadcastMessage(message);
        break;
      case 'connection':
        broadcastMessage(message);
        break;
    }
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}
