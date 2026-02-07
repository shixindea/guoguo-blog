type Listener = (message: string) => void;

let listeners: Listener[] = [];

export function notify(message: string) {
  if (!message) return;
  listeners.forEach((l) => l(message));
}

export function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

