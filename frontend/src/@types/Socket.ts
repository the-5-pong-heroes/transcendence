import { type Socket } from "socket.io-client";

export interface SocketContextParameters {
  customSocket: CustomSocket;
  socketRef: React.MutableRefObject<Socket | undefined>;
  socketReady: boolean;
}

export interface SocketParameters {
  customSocket: CustomSocket;
  socket: Socket | undefined;
  socketReady: boolean;
}

export class CustomSocket {
  private socketRef: React.MutableRefObject<Socket | undefined>;

  constructor(socketRef: React.MutableRefObject<Socket | undefined>) {
    this.socketRef = socketRef;
  }

  // public emit<T>(event: string, ...args: T[]): void {
  public emit(event: string, ...args: any[]): void {
    this.socketRef.current?.emit(event, ...(args as [any]));
  }

  public on<T>(event: string, callback: (...args: T[]) => void): void {
    this.socketRef.current?.on(event, callback);
  }

  public off<T>(event: string, callback?: (...args: T[]) => void): void {
    this.socketRef.current?.off(event, callback);
  }
}
