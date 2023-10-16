import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/services/user.service';
import { userProviders } from '../user/providers/user.provider';
import { DatabaseModule } from 'src/database/database.module';
import { loginInfoProviders } from './providers/login.provider';
import { tenantProviders } from 'src/middlewares/tenant/tenant.provider';
import { TenantService } from 'src/middlewares/tenant/tenant.service';

@Module({
    imports: [
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2', // Change this to your actual secret key
            signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
    ],
    controllers: [AuthController],
    providers: [
        ...loginInfoProviders,
        ...userProviders,
        UserService, 
        AuthService, 
        JwtStrategy,
        ...tenantProviders,
        TenantService
    ],
    exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule { }