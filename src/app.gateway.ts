import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SubscribeMessage } from "@nestjs/websockets/decorators";
import { Socket as SocketIO, Server as ServerIO } from 'socket.io';
import { LoginDto } from "./common/dto/login.dto";
import { SignupDto } from "./common/dto/signup.dto";
import { AuthService } from "./services/auth.service";

/**
 * Authorization params
 */

class AuthDto {
  jwt_token: string;
}



@WebSocketGateway(
  8080,
  {
    path: '/api/chat',
    cors: true,
  }
)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: ServerIO;

  constructor(
    private readonly authService: AuthService
  ) {}
  /**
   * Handle client connection
   * @param client 
   * @param args 
   */
  public async handleConnection(client: SocketIO, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  /**
   * Handle client disconnection
   * @param client 
   */
  public async handleDisconnect(client: SocketIO) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('authorization')
  public async handleAuthorization(client: SocketIO, data: LoginDto) {
    const { login, password } = data;
    
    try {
      const jwt_token = await this.authService.logIn(data);
      console.log(jwt_token)
    } catch (err) {
      client.emit('authError', { message: err.message });
    }
  }
  
  @SubscribeMessage('registration')
  public async handleRegistration(client: SocketIO, data: SignupDto) {
    console.log(data)
  }

  @SubscribeMessage('checkAuth')
  public async handleCheckAuth(client: SocketIO, data: AuthDto) {}

  @SubscribeMessage('getUpdatesChats')
  public async handleGetUpdatesChats(client: SocketIO) {}

  @SubscribeMessage('joinToChat')
  public async handleJoinToChat(client: SocketIO) {}

  @SubscribeMessage('leaveChat')
  public async handleLeaveChat(client: SocketIO) {}

  @SubscribeMessage('sendMessage')
  public async handleSendMessage(client: SocketIO) {}

  @SubscribeMessage('writeMessage')
  public async handleWriteMessage(client: SocketIO) {}
  /**
   * 
   */
  private async emitWriteMessage(chatId: string) {
    this.server.to(chatId).emit('writeMessage', {});
  }
  /**
   * 
   * @param chatId 
   * @param message 
   */
  private async emitNewMessage(chatId: string, message: any) {
    this.server.to(chatId).emit('newMessage', { message })
  }
}