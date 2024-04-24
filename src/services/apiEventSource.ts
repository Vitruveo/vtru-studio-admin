import { fetchEventSource } from '@microsoft/fetch-event-source';
import { BASE_URL_API } from '@/constants/api';
import store from '@/store';

interface FetchEventSourceParams<T> {
    path: string;
    callback(data: T): void;
    filter?: {
        query?: string;
    };
}

const buildSearchQuery = (search?: string) => {
    if (!search) return '';

    const queries = [
        `query[$or][0][assetMetadata.context.formData.title][$regex]=${search}`,
        `query[$or][0][assetMetadata.context.formData.title][$options]=i`,
        `query[$or][1][assetMetadata.context.formData.description][$regex]=${search}`,
        `query[$or][1][assetMetadata.context.formData.description][$options]=i`,
    ];
    const query = queries.join('&');
    return query;
};

export const list = async <T = undefined>({ callback, path, filter }: FetchEventSourceParams<T>) => {
    const state = store.getState();
    const token = state.user.token;
    const searchQuery = buildSearchQuery(filter?.query);

    const url = `${BASE_URL_API}/${path}?${searchQuery}`;
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
