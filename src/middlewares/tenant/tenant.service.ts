// tenant.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
    constructor(
        @Inject('TENANT_REPOSITORY')
        private tenantRepository: Repository<Tenant>,
    ) { }

    async createTenant(email: string): Promise<Tenant> {
        const tenant = this.tenantRepository.create({ 
            email,
            createdAt: new Date()
        });
        return this.tenantRepository.save(tenant);
    }

    async findTenantByName(email: string): Promise<Tenant | undefined> {
        return this.tenantRepository.findOne({ where: { email } });
    }
}
