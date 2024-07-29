import { useCallback, useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { useSelector } from '@/store/hooks';
import { BASE_URL_API } from '@/constants/api';

interface Props {
    event: {
        list: string;
        update: string;
        delete: string;
        create: string;
    };
    listemEvents: string[];
}

export const useLiveStream = <T,>({ event, listemEvents }: Props) => {
    const token = useSelector((state) => state.auth.token);
    const [chunk, setChunk] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    const ctrl = new AbortController();

    const headers = {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
    };

    const fetchData = useCallback(() => {
        const url = `${BASE_URL_API}/events?timestamp=${new Date().getTime()}&events=${listemEvents.join(',')}`;

        fetchEventSource(url, {
            method: 'GET',
            headers,
            signal: ctrl.signal,
            onmessage(message) {
                const parsed = JSON.parse(message.data);

                if (message.event === event.list) {
                    setChunk(parsed);
                    setLoading(false);
                }

                if (message.event === event.update) {
                    setChunk((prev) => {
                        const index = prev.findIndex((item: any) => item._id === parsed._id);

                        if (index !== -1) {
                            return [...prev.slice(0, index), parsed, ...prev.slice(index + 1)];
                        }

                        return prev;
                    });
                }

                if (message.event === event.delete) {
                    setChunk((prev) => prev.filter((item: any) => item._id !== parsed._id));
                }

                if (message.event === event.create) {
                    setChunk((prev) => [parsed, ...prev]);
                }
            },
            onerror() {
                console.log('Event source error');
            },
            onclose() {
                console.log('Event source closed');
            },
            // abort event
        });
    }, [ctrl]);

    useEffect(() => {
        fetchData();

        return () => {
            ctrl.abort();
        };
    }, []);

    return {
        chunk,
        loading,
    };
};
