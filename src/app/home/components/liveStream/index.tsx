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
    const [chunk, setChunk] = useState<Record<string, T>>({});
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
                    setChunk((prevState) => {
                        if (prevState[parsed._id]) return prevState;

                        return {
                            ...prevState,
                            [parsed._id]: parsed,
                        };
                    });
                    if (loading) setLoading(false);
                }

                if (message.event === event.update || message.event === event.create) {
                    setChunk((prev) => ({
                        ...prev,
                        [parsed._id]: parsed,
                    }));
                }

                if (message.event === event.delete) {
                    setChunk((prev) => {
                        delete prev[parsed._id];
                        return prev;
                    });
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
        chunk: Object.values(chunk),
        loading,
    };
};
