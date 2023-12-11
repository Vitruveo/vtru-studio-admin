'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '@/store/hooks';
import { subscribeWebSocketThunk, unsubscribeWebSocketThunk, websocketSelector } from '@/features/ws';

export default function Creators() {
  const dispatch = useDispatch();
  const { messages = [] } = useSelector(websocketSelector(['messages']));

  useEffect(() => {
    dispatch(subscribeWebSocketThunk());

    return () => {
      dispatch(unsubscribeWebSocketThunk());
    };
  }, []);

  return (
    <div>
      {messages.map((item) => (
        <span key={item}>
          {item} <br />
        </span>
      ))}
    </div>
  );
}
