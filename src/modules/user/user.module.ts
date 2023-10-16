import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userProviders } from './providers/user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    UserController
  ],
  providers: [
    ...userProviders,
    UserService,
  ]
})

export class userModule { }
