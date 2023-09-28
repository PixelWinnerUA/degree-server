import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "./models/users.model";
import { InjectModel } from "@nestjs/sequelize";
import { hash } from "bcrypt";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { ResponseMessages } from "../../common/constants/messages.constants";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async create(dto: CreateUserDto): Promise<User> {
        dto.password = await this.hashPassword(dto.password);

        return await this.userRepository.create(dto);
    }

    async getPublicUser(email: string): Promise<Omit<User, "password">> {
        return await this.userRepository.findOne({ where: { email }, attributes: { exclude: ["password"] } });
    }

    async updateUserName(dto: UpdateUserDto, id: number): Promise<string> {
        const affectedUsers = await this.userRepository.update(dto, { where: { id } });

        if (affectedUsers[0] !== 1) {
            throw new BadRequestException();
        }

        return ResponseMessages.SUCCESS_NAME_UPDATE;
    }
}
