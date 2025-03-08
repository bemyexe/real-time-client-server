import {FormEvent, useRef, useState} from 'react';

interface Message {
  event: 'connection' | 'message';
  username: string;
  message?: string;
  id: number;
}

export const WebSockets = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');
  const socket = useRef<WebSocket>(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  const connect = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.current = new WebSocket('ws://localhost:5000');
    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      };
      socket?.current?.send(JSON.stringify(message));
      console.log('WebSocket connection opened');
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.current.onerror = () => {
      console.log('WebSocket connection error');
    };
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
    };
    socket?.current?.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div>
        <h1>WebSocket</h1>
        <form onSubmit={connect}>
          <input
            placeholder="Enter your name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>real time chat</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.map(({id, event, username, message}) => (
          <div key={id}>
            {event === 'connection' ? (
              <p>{username} connected</p>
            ) : (
              <div style={{border: '2px solid black'}}>
                <p style={{fontWeight: 'bold', backgroundColor: 'gainsboro'}}>
                  {username}:{' '}
                </p>
                {message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
