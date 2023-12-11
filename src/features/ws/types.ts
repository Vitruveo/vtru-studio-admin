import { Socket } from 'socket.io-client';

export interface WebsocketSliceState {
  connection: Socket | null;
  messages: string[];
}
