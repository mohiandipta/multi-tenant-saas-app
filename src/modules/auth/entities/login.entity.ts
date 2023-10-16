import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblLogin_info')
export class Login_info {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'int', width: 50, nullable: true })
    enroll: number;

    @Column({ type: 'date', nullable: true })
    lastLogin: Date;

    @Column({ type: 'varchar', length: 512, nullable: true })
    access_token: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    refresh_token: string;
    // Add more properties as needed
}
