import { Module } from '@nestjs/common';
import { MessengerModule } from './messenger/messenger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChatsEntity } from './messenger/entities/Chats.entity';
import { MessagesEntity } from './messenger/entities/Messages.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [ChatsEntity, MessagesEntity],
      autoLoadEntities: true,
      //NB! attr synchronize is not safe for prod, migrations is better.
      synchronize: true,
    }),
    MessengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
