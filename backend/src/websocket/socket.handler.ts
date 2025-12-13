import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { TokenPayload } from '../types/models';
import { logger } from '../utils/logger';

export class SocketHandler {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
        socket.data.user = {
          id: decoded.userId,
          username: decoded.username,
        };
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;
      logger.info(`User connected: ${user.username} (${socket.id})`);

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${user.username} (${socket.id})`);
      });

      socket.on('error', (error) => {
        logger.error('Socket error:', error);
      });
    });
  }

  // Broadcast methods for real-time updates
  broadcast(event: string, data: unknown) {
    this.io.emit(event, data);
  }

  broadcastToUser(userId: string, event: string, data: unknown) {
    // Find all sockets for this user and emit to them
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.data.user?.id === userId) {
        socket.emit(event, data);
      }
    });
  }

  // Event broadcasting methods
  broadcastEventCreated(event: unknown) {
    this.broadcast('event:created', { event });
  }

  broadcastEventUpdated(event: unknown) {
    this.broadcast('event:updated', { event });
  }

  broadcastEventDeleted(id: string) {
    this.broadcast('event:deleted', { id });
  }

  broadcastVacationCreated(vacation: unknown) {
    this.broadcast('vacation:created', { vacation });
  }

  broadcastVacationUpdated(vacation: unknown) {
    this.broadcast('vacation:updated', { vacation });
  }

  broadcastVacationDeleted(id: string) {
    this.broadcast('vacation:deleted', { id });
  }

  broadcastTimelineCreated(event: unknown) {
    this.broadcast('timeline:created', { event });
  }

  broadcastTimelineUpdated(event: unknown) {
    this.broadcast('timeline:updated', { event });
  }

  broadcastTimelineDeleted(id: string) {
    this.broadcast('timeline:deleted', { id });
  }

  broadcastScoreUpdated(score: unknown) {
    this.broadcast('score:updated', { score });
  }

  getIO() {
    return this.io;
  }
}

let socketHandler: SocketHandler;

export const initializeSocketHandler = (httpServer: HTTPServer) => {
  socketHandler = new SocketHandler(httpServer);
  return socketHandler;
};

export const getSocketHandler = (): SocketHandler => {
  if (!socketHandler) {
    throw new Error('Socket handler not initialized');
  }
  return socketHandler;
};

// Helper functions to broadcast events
export const broadcastEventCreated = (event: unknown) => {
  getSocketHandler().broadcastEventCreated(event);
};

export const broadcastEventUpdated = (event: unknown) => {
  getSocketHandler().broadcastEventUpdated(event);
};

export const broadcastEventDeleted = (id: string) => {
  getSocketHandler().broadcastEventDeleted(id);
};

export const broadcastVacationCreated = (vacation: unknown) => {
  getSocketHandler().broadcastVacationCreated(vacation);
};

export const broadcastVacationUpdated = (vacation: unknown) => {
  getSocketHandler().broadcastVacationUpdated(vacation);
};

export const broadcastVacationDeleted = (id: string) => {
  getSocketHandler().broadcastVacationDeleted(id);
};

export const broadcastTimelineCreated = (event: unknown) => {
  getSocketHandler().broadcastTimelineCreated(event);
};

export const broadcastTimelineUpdated = (event: unknown) => {
  getSocketHandler().broadcastTimelineUpdated(event);
};

export const broadcastTimelineDeleted = (id: string) => {
  getSocketHandler().broadcastTimelineDeleted(id);
};

export const broadcastScoreUpdated = (score: unknown) => {
  getSocketHandler().broadcastScoreUpdated(score);
};
