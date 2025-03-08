import {useEffect, useState} from 'react';

interface Message {
  message: string;
  index: number;
}

export const EventSourcing = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:5000/connect');
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('http://localhost:5000/new-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: value, index: Date.now()}),
    });
    setValue('');
  };

  return (
    <div>
      <h1>Long Polling</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      <div>
        {messages.map(({message, index}) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};
