import { BadRequestException, Injectable } from "@nestjs/common";
import { AddUserToStorageDto, CreateStorageDto, DeleteStorageDto, DeleteUserFromStorageDto, UpdateStorageDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Storage } from "./models/storages.model";
import { UserStorage } from "./models/user-storage.model";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { AppError } from "../../common/constants/errors.constants";
import { GetStorageInfoResponse, GetStorageResponse } from "./response";
import { FindOptions } from "sequelize";
import { getResponseMessageObjectHelper } from "../../common/helpers/getResponseMessageObject.helper";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { User } from "../users/models/users.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class StoragesService {
    constructor(
        @InjectModel(Storage) private storageRepository: typeof Storage,
        @InjectModel(UserStorage) private userStorageRepository: typeof UserStorage,
        private readonly usersService: UsersService
    ) {}

    async create(dto: CreateStorageDto, userId: number): Promise<SuccessMessageResponse> {
        const storage = await this.storageRepository.create({ ...dto, ownerId: userId });

        const userStorage = {
            userId,
            storageId: storage.id
        };

        await this.userStorageRepository.create(userStorage);

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_STORAGE_CREATE);
    }

    async findById(storageId: number, options?: Omit<FindOptions<Storage>, "where">): Promise<Storage> {
        return await this.storageRepository.findByPk(storageId, options);
    }

    async userHasAccessToStorage(userId: number, storageId: number): Promise<boolean> {
        const userStorage = await UserStorage.findOne({
            where: {
                userId,
                storageId
            }
        });

        return !!userStorage;
    }

    async update(dto: UpdateStorageDto): Promise<SuccessMessageResponse> {
        const { id, name } = dto;
        const storage = await this.findById(id);
        storage.name = name;

        try {
            await storage.save();
        } catch (e) {
            throw new BadRequestException(AppError.STORAGE_UPDATE_ERROR);
        }

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE);
    }

    async delete(dto: DeleteStorageDto): Promise<SuccessMessageResponse> {
        const storage = await this.findById(dto.id);

        await this.userStorageRepository.destroy({
            where: {
                storageId: dto.id
            }
        });

        await storage.destroy();

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_STORAGE_DELETE);
    }

    async getStoragesByUserId(userId: number): Promise<GetStorageResponse[]> {
        const storages = await this.storageRepository.findAll({
            include: [
                {
                    model: User,
                    where: { id: userId },
                    attributes: []
                }
            ]
        });

        return storages as GetStorageResponse[];
    }

    async getUsersById(id: number): Promise<User[]> {
        const storage = await this.findById(id, {
            include: [
                {
                    model: User,
                    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
                    through: { attributes: [] }
                }
            ]
        });

        return storage.users;
    }

    async getStorageInfo(id: number): Promise<GetStorageInfoResponse> {
        const users = await this.getUsersById(id);
        const storage = await this.findById(id);

        return { storage, users };
    }

    async deleteUserFromStorage(dto: DeleteUserFromStorageDto, requestUserId: number): Promise<SuccessMessageResponse> {
        const storage = await this.findById(dto.id);
        const hasAccess = requestUserId === storage.ownerId;

        if (!hasAccess) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        await this.userStorageRepository.destroy({
            where: {
                storageId: dto.id,
                userId: dto.userId
            }
        });

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_USER_DELETE_FROM_STORAGE);
    }

    async addUserToStorage(dto: AddUserToStorageDto, requestUserId: number): Promise<SuccessMessageResponse> {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new BadRequestException(AppError.USER_NOT_EXIST);
        }

        if (user.id === requestUserId) {
            throw new BadRequestException(AppError.CANNOT_ADD_YOURSELF);
        }

        const userStorage = await this.userStorageRepository.findOne({ where: { userId: user.id, storageId: dto.storageId } });

        if (userStorage) {
            throw new BadRequestException(AppError.USER_ALREADY_IN_LIST);
        }

        await this.userStorageRepository.create({ userId: user.id, storageId: dto.storageId });

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_USER_ADD);
    }
}
