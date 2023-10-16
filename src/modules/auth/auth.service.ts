import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserDTO } from '../user/dtos/user.dto';
import { compare } from 'bcrypt';
import { hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { Login_info } from './entities/login.entity';
import { LoginInfo } from 'src/types/loginInfoType';
import { TenantService } from 'src/middlewares/tenant/tenant.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject('LOGININFO_REPOSITORY')
        private loginInfoRepository: Repository<Login_info>,
        private tenantService: TenantService,
        private readonly jwtService: JwtService, 
        private readonly userService: UserService) { }

    async validateUser(userDTO: UserDTO): Promise<User | null> {
        const user = await this.userService.findByEnroll(userDTO.enroll)

        if (!user) {
            return null; // User not found
        }

        const passwordMatch = await compare(userDTO.password, user.password);

        if (passwordMatch) {
            return user; // User found and password is correct
        }

        return null; // Password is incorrect
    }

    async register(userDTO: UserDTO) {
        const user = await this.userService.findByEnroll(userDTO.enroll)
        if (user) {
            throw new UnauthorizedException('user already exist!');
        }

        const hashedPassword = await hashPassword(userDTO.password)

        await this.userService.createuser({
            username: userDTO.username,
            email: userDTO.email,
            password: hashedPassword,
            enroll: userDTO.enroll,
            role: userDTO.role,
        })

        await this.tenantService.createTenant(userDTO.email)

        return { 
            username: userDTO.username,
            email: userDTO.email,
            enroll: userDTO.enroll,
            role: userDTO.role,
        };
    }

    async login(userDTO: UserDTO): Promise<LoginInfo> {

        const user = await this.userService.findByEnroll(userDTO.enroll)
        if (!user) {
            throw new UnauthorizedException('user not found with this email!');
        }

        const passwordMatched = await compare(userDTO.password, user.password)
        console.log(passwordMatched)

        if (!passwordMatched) {
            throw new UnauthorizedException('invalid credential!');
        }

        const payload = { username: userDTO.username, email: userDTO.email, enroll: user.enroll, password: userDTO.password, role: user.role,  };

        // Sign the JWT token using the JWT service
        const access_token = this.jwtService.sign(payload);

        const existingUser = await this.loginInfoRepository.findOne({
            where: {
                email: userDTO.email,
            },
        });

        if (!existingUser) {
            // If the user does not exist, create a new record
            const newUser = this.loginInfoRepository.create({
                username: userDTO.username,
                email: userDTO.email,
                enroll: userDTO.enroll,
                lastLogin: new Date(),
                access_token,
                refresh_token: '',
            });
            await this.loginInfoRepository.save(newUser);
        } else {
            // If the user exists, update the existing record
            existingUser.lastLogin = new Date();
            existingUser.access_token = access_token;
            existingUser.refresh_token = '';
            await this.loginInfoRepository.save(existingUser);
        }

        return {
            username: user.username,
            email: user.email,
            role: user.role,
            access_token: access_token,
            refresh_token: ''
        };
    }
}