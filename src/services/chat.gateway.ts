import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

enum SocketEvent {
  System = 'system',
  Message = 'message',
  Statistic = 'statistic',
}

@WebSocketGateway({
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Map<string, Socket> = new Map();

  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  @SubscribeMessage(SocketEvent.Message)
  handleMessage(client: Socket, payload: string): void {
    this.server.emit(SocketEvent.Message, payload);
  }

  afterInit(_: Server) {
    this.logger.log('聊天室初始化');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WS 客户端断开连接: ${client.id}`);
    this.clients.delete(client.id);
    this.sendStatistics();
  }

  @UseGuards(AuthGuard('jwt'))
  handleConnection(client: Socket) {
    // TOKEN 校验

    // const token = client.handshake.headers.authorization;
    // const user = this.authService.parseToken(token.split(' ')[1]);
    // if (!user) {
    //   return client.disconnect(true);
    // }

    this.logger.log(`WS 客户端连接成功: ${client.id}`);
    this.clients.set(client.id, client);
    client.emit(SocketEvent.System, '聊天室连接成功');
    this.sendStatistics();
  }

  sendStatistics() {
    this.server.emit(SocketEvent.Statistic, this.clients.size);
  }
}
