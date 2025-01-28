import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { useSelector } from '@/store/hooks';
import { BASE_URL_API } from '@/constants/api';

interface Props {
    getData?: boolean;
    event: {
        list: string;
        update: string;
        delete: string;
        create: string;
    };
    listemEvents: string[];
}

export const useLiveStream = <T,>({ event, listemEvents, getData }: Props) => {
    const token = useSelector((state) => state.auth.token);
    const [updated, setUpdated] = useState(false);
    const [chunk, setChunk] = useState<Record<string, T>>({});
    const [loading, setLoading] = useState(true);

    const headers = {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
    };

    useEffect(() => {
        const ctrl = new AbortController();
        const url = `${BASE_URL_API}/events?timestamp=${new Date().getTime()}&events=${listemEvents.join(',')}`;

        fetchEventSource(url, {
            method: 'GET',
            headers,
            signal: ctrl.signal,
            onmessage(message) {
                const parsed = JSON.parse(message.data);
                const id = parsed._id || parsed.id;

                if (message.event === event.list) {
                    setChunk((prevState) => {
                        if (prevState[id]) return prevState;

                        return {
                            ...prevState,
                            [id]: parsed,
                        };
                    });
                    if (loading) setLoading(false);
                }

                if (message.event === event.update || message.event === event.create) {
                    setUpdated((prev) => !prev);
                    setChunk((prev) => ({
                        ...prev,
                        [id]: parsed,
                    }));
                }

                if (message.event === event.delete) {
                    setUpdated((prev) => !prev);
                    setChunk((prev) => {
                        delete prev[id];
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
        });

        return () => {
            if (ctrl) {
                ctrl.abort();
            }
        };
    }, [getData]);

    return {
        chunk: Object.values(chunk),
        chumkById: chunk,
        loading,
        updated,
    };
};
