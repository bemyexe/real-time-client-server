import {EventSourcing} from './event-sourcing';
import {LongPolling} from './long-polling';

export function App() {
  return (
    <div>
      <h1>App</h1>
      {/* <LongPolling /> */}
      <EventSourcing />
    </div>
  );
}
