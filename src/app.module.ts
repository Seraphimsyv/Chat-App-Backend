import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { Chat, Message, UnreadedMessage } from './entities/chat.entity';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JWT_CONSTANTS } from './services/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'messanger',
      entities: [
        User,
        Chat, Message, UnreadedMessage
      ],
      synchronize: true
    }),
    TypeOrmModule.forFeature([User, Chat, Message, UnreadedMessage]),
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [AppController],
  providers: [
    AppGateway,
    AuthService,
  ],
})
export class AppModule {}
