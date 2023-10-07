import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "./models/users.model";
import { InjectModel } from "@nestjs/sequelize";
import { hash } from "bcrypt";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { AppError } from "../../common/constants/errors.constants";
import { FindOptions } from "sequelize";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async findByEmail(email: string, options?: Omit<FindOptions<User>, "where">): Promise<User> {
        return await this.userRepository.findByPk(email, options);
    }

    async findById(id: number, options?: Omit<FindOptions<User>, "where">): Promise<User> {
        return await this.userRepository.findByPk(id, options);
    }

    async create(dto: CreateUserDto): Promise<User> {
        dto.password = await this.hashPassword(dto.password);

        return await this.userRepository.create(dto);
    }

    async getPublicUser(email: string): Promise<Omit<User, "password">> {
        return await this.findByEmail(email, { attributes: { exclude: ["password"] } });
    }

    async updateUserName(dto: UpdateUserDto, id: number): Promise<string> {
        const [affectedUsers] = await this.userRepository.update(dto, { where: { id } });

        if (affectedUsers !== 1) {
            throw new BadRequestException(AppError.USER_UPDATE_ERROR);
        }

        return ResponseMessages.SUCCESS_USER_NAME_UPDATE;
    }
}
