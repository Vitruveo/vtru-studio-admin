import store from '@/store';
import { fetchEventSource } from '@microsoft/fetch-event-source';

interface FetchEventSourceParams<T> {
  path: string;
  callback(data: T): void;
}

export const list = async <T = undefined>({ callback, path }: FetchEventSourceParams<T>) => {
  const state = store.getState();
  const token = state.user.token;

  const url = `${process.env.BASE_URL || 'http://127.0.0.1:5001'}/${path}`;
  const headers = {
    Accept: 'text/event-stream',
    Authorization: `Bearer ${token}`,
  };

  return fetchEventSource(url, {
    method: 'GET',
    headers,
    onmessage(event) {
      const parsedData = JSON.parse(event.data);
      callback(parsedData);
    },
    onclose() {
      console.log('onclose fetchEventSource');
    },
    onerror() {
      console.log('onerror fetchEventSource');
    },
    async onopen(response) {
      console.log(`response onopen fetchEventSource: ${response}`);
    },
  });
};
