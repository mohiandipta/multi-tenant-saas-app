import { Body, Controller, Get, Post, Delete, Req, Res, Next, Put, Param, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import { UserDTO } from '../dtos/user.dto';
import { NOT_FOUND, REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { notFound, requestInvalid, success } from 'src/helpers/http';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    // @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const data: any = await this.userService.findAll()
            if (data.length === 0) {
                return response
                .status(404)
                .json(notFound('Currently there is no user'));
            }
            return response.status(SUCCESS).json(success(data));
        } catch (error) {
            console.log(error);
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Get(':id')
    async findById(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number,
    ) {
        try {
            const data: any = await this.userService.findById(id)
            if (data === null) {
                return response
                    .status(404)
                    .json(notFound('Currently there is no user'));
            }
            return response.status(SUCCESS).json(success(data));
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Post()
    async createuser(
        @Req() request: Request,
        @Res() response: Response, 
        @Body() userDTO: UserDTO
        ) {
            try {
                const data: any = this.userService.createuser(userDTO)

                if (data?.status === 400)
                    return response.status(REQUEST_ERROR).json(requestInvalid(data))

                return response.status(SUCCESS).json(success(data))
            } catch (error) {
                return response.status(REQUEST_ERROR).json(requestInvalid(error));
            }
    }

    @Put(':id')
    async userUpdate(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number,
        @Body() userDTO: UserDTO
        ){
            try {
                const data = await this.userService.updateuser(id, userDTO);
                
                return response.status(SUCCESS).json(success(data))
            } catch (error) {
                return response.status(REQUEST_ERROR).json(requestInvalid(error));
            }
        }

    @Delete(':id')
    async userDelete(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        try {
            const data = await this.userService.delete(id)
            if (data.affected === 0) {
                return response
                    .status(404)
                    .json(notFound(`user with ID ${id} not found`));
            }

            return response.status(SUCCESS).json(success(`user with ID ${id} has been deleted`))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }
}
