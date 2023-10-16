// tenant.middleware.ts
import { Injectable, NestMiddleware, Next, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly tenantService: TenantService) { }

    async use(
        @Req() request: Request & { tenant: Tenant },
        @Res() response: Response,
        @Next() next: NextFunction
    ) {
        const tenantName: any = request.headers['x-tenant'];
        const tenant = await this.tenantService.findTenantByName(tenantName);

        if (tenant) {
            request.tenant = tenant
            next();
        } else {
            // Handle invalid or missing tenant here
            response.status(403).send('Tenant not found!');
        }
    }
}
