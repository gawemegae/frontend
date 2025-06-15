import { io, Socket } from 'socket.io-client';

export class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private connectionAttempted: boolean = false;
  private isConnected: boolean = false;

  connect() {
    // Skip socket connection for now since Next.js doesn't have a Socket.IO server
    // This prevents the WebSocket connection errors
    console.log('Socket connection skipped - no Socket.IO server available');
    return;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionAttempted = false;
    this.isConnected = false;
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    if (this.socket && this.isConnected) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        if (this.socket) {
          this.socket.off(event, callback as any);
        }
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const socketManager = new SocketManager();