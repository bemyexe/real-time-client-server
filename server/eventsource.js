const express = require('express'); // импортриуем express
const cors = require('cors'); // импортриуем cors
const events = require('events'); // импортриуем модуль events, это способ управления событиями в nodejs (чтобы мы могли возвращать ответ на клиент по событию)
const PORT = 5000;

const emitter = new events.EventEmitter(); // создаем эмиттер, для регистрации, подписки и вызова событий

const app = express(); // создаем экземпляр приложения express

app.use(cors()); // включаем cors middleware
app.use(express.json()); // включаем middleware для парсинга json

app.get('/connect', (req, res) => {
  res.writeHead(200, {
    connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'cache-control': 'no-cache',
  });
  emitter.on('newMessage', (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}); // реализуем ендпоинт на получение запроса

app.post('/new-messages', (req, res) => {
  //функция для отправки сообщений.
  const message = req.body; // достаем сообщение из тела запроса
  emitter.emit('newMessage', message); // вызываем событие по тому же названию 'newMessage' и вторым параметром передаем сообщение
  res.status(200); // возвращаем статус код 200
  res.end();
}); // реализуем ендпоинт на отправку запроса

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // прослушиваем 5000 порт, если все ок, то выводим в консоль
