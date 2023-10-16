import { DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';

export const tenantProviders = [
    {
        provide: 'TENANT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Tenant),
        inject: ['DATA_SOURCE'],
    },
];
