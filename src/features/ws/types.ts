import { Socket } from 'socket.io-client';

interface Creator {
  _id: string;
  email: string;
}
export interface WebsocketSliceState {
  connection: Socket | null;
  creatorsOnline: Creator[];
}
