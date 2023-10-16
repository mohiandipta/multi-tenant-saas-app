import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { tenantProviders } from './tenant.provider';
import { TenantService } from './tenant.service';
import { TenantMiddleware } from './tenant.middleware';

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [
        ...tenantProviders,
        TenantService
    ]
})

export class TenantModule { }
