import { Socket } from 'net';
export type TelnetClient = Socket & { nickname: string; };

export interface ConnectedClients {
  [key: string]: Socket;
}
