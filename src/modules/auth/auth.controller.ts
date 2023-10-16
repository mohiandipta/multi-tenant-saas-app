import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/dtos/user.dto';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { requestInvalid, success } from 'src/helpers/http';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Req() request: Request,
        @Res() response: Response,
        @Body() userDTO: UserDTO
    ) {
        try {
            const data: any = this.authService.register(userDTO)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Post('login')
    async login(
        @Req() request: Request,
        @Res() response: Response,
        @Body() userDTO: UserDTO
    ) {
        try {
            const data = await this.authService.login(userDTO);

            return response.status(SUCCESS).json(success(data));
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }
}
