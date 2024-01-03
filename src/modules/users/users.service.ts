import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "./models/users.model";
import { InjectModel } from "@nestjs/sequelize";
import { hash } from "bcrypt";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { AppError } from "../../common/constants/errors.constants";
import { FindAttributeOptions, FindOptions } from "sequelize";
import { GetPublicUserResponse } from "./response";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async findByEmail(email: string, attributes?: FindAttributeOptions): Promise<User> {
        return await this.userRepository.findOne({ where: { email }, attributes });
    }

    async findById(id: number, options?: Omit<FindOptions<User>, "where">): Promise<User> {
        return await this.userRepository.findByPk(id, options);
    }

    async create(dto: CreateUserDto): Promise<User> {
        dto.password = await this.hashPassword(dto.password);

        return await this.userRepository.create(dto);
    }

    async getPublicUser(id: number): Promise<GetPublicUserResponse> {
        return await this.findById(id, { attributes: { exclude: ["password", "createdAt", "updatedAt"] } });
    }

    async updateUserName(dto: UpdateUserDto, id: number): Promise<SuccessMessageResponse> {
        const user = await this.findById(id);
        Object.assign(user, dto);

        try {
            await user.save();
        } catch (e) {
            throw new BadRequestException(AppError.USER_UPDATE_ERROR);
        }

        return getResponseMessageObject(ResponseMessages.SUCCESS_USER_NAME_UPDATE);
    }
}
