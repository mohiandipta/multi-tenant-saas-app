import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { userModule } from './modules/user/user.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import * as fs from 'fs';
import { AuthModule } from './modules/auth/auth.module';
import { TenantMiddleware } from './middlewares/tenant/tenant.middleware';
import { TenantModule } from './middlewares/tenant/tenant.module';
import { TenantService } from './middlewares/tenant/tenant.service';
import { tenantProviders } from './middlewares/tenant/tenant.provider';
import { DatabaseModule } from './database/database.module';

const logsFolderPath = 'logs';

// Ensure the logs folder exists, create it if not
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath);
}

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: [
            'req.headers',
            'res.headers',
            'req.remoteAddress',
            'req.remotePort',
          ],
          remove: true,
        },
        transport: {
          target: 'pino/file',
          options: {
            // Specify the log file path
            destination: `${logsFolderPath}/app.log`, // Change this to your desired log file path
          },
        },
      },
    }),

    TenantModule,
    userModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, 
    ...tenantProviders,
    TenantService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware)
    .exclude(
      { path: 'auth/login', method: RequestMethod.ALL },
      { path: 'auth/register', method: RequestMethod.ALL }
    )
    .forRoutes('*');
  }
}
