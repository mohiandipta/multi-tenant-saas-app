import { DataSource } from 'typeorm';
import { Login_info } from '../entities/login.entity';

export const loginInfoProviders = [
    {
        provide: 'LOGININFO_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Login_info),
        inject: ['DATA_SOURCE'],
    },
];
