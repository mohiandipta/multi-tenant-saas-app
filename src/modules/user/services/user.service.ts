import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDTO } from '../dtos/user.dto';
import { DataBaseReturnType } from 'src/types/databaseReturnType';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        const info = this.userRepository.find();

        return info
    }

    async findByEnroll(enroll: number): Promise<User> {
        const info = this.userRepository.findOneBy({ enroll });

        return info
    }

    async findById(id: number): Promise<User> {
        const info = await this.userRepository.findOneBy({id})

        return info
    }

    async createuser(userDTO: UserDTO){
        this.userRepository.create(userDTO);
        const info = await this.userRepository.save(userDTO)

        return { status: 200, data: info };
    }

    async updateuser(id: number, userDTO: UserDTO): Promise<User> {
        const updateResult = await this.userRepository.update(id, userDTO);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`user with ID ${id} not found`);
        }

        const updateduser = await this.userRepository.findOne({where: {id}})

        return updateduser;
    }

    async delete(id: number): Promise<DataBaseReturnType>{
        const updateResult = await this.userRepository.delete(id)
        if (updateResult.affected === 0) {
            return updateResult as DataBaseReturnType
        }

        return updateResult as DataBaseReturnType
    }
}
