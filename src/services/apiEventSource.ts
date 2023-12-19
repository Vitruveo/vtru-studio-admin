import { fetchEventSource } from '@microsoft/fetch-event-source';
import { BASE_URL } from '@/constants/api';
import store from '@/store';

interface FetchEventSourceParams<T> {
  path: string;
  callback(data: T): void;
}

export const list = async <T = undefined>({ callback, path }: FetchEventSourceParams<T>) => {
  const state = store.getState();
  const token = state.user.token;

  const url = `${BASE_URL}/${path}`;
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
