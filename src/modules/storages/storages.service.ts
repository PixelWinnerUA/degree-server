import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStorageDto, DeleteStorageDto, UpdateStorageDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Storage } from "./models/storages.model";
import { UserStorage } from "./models/user-storage.model";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { AppError } from "../../common/constants/errors.constants";
import { GetStoragesResponse } from "./response";
import { ShelvesService } from "../shelves/shelves.service";
import { CreateShelfDto } from "../shelves/dto";
import { Shelf } from "../shelves/models/shelves.model";
import { FindOptions } from "sequelize";
import { UsersService } from "../users/users.service";

@Injectable()
export class StoragesService {
    constructor(
        @InjectModel(Storage) private storageRepository: typeof Storage,
        @InjectModel(UserStorage) private userStorageRepository: typeof UserStorage,
        private readonly shelvesService: ShelvesService,
        private readonly usersService: UsersService
    ) {}

    async create(dto: CreateStorageDto, userId: number): Promise<typeof ResponseMessages.SUCCESS_STORAGE_CREATE> {
        const storage = await this.storageRepository.create(dto);

        const userStorage = {
            userId,
            storageId: storage.id
        };

        await this.userStorageRepository.create(userStorage);

        return ResponseMessages.SUCCESS_STORAGE_CREATE;
    }

    async findById(storageId: number, options?: Omit<FindOptions<Storage>, "where">) {
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

    async update(dto: UpdateStorageDto): Promise<typeof ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE> {
        const { id, name } = dto;

        const [affectedStorages] = await this.storageRepository.update({ name }, { where: { id } });

        if (affectedStorages !== 1) {
            throw new BadRequestException(AppError.STORAGE_UPDATE_ERROR);
        }

        return ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE;
    }

    async delete(dto: DeleteStorageDto): Promise<typeof ResponseMessages.SUCCESS_STORAGE_DELETE> {
        const storage = await this.findById(dto.id);

        await UserStorage.destroy({
            where: {
                storageId: dto.id
            }
        });

        await storage.destroy();

        return ResponseMessages.SUCCESS_STORAGE_DELETE;
    }

    async getStoragesByUserId(userId: number): Promise<GetStoragesResponse[]> {
        const user = await this.usersService.findById(userId, { include: Storage });

        if (!user) {
            throw new BadRequestException(AppError.USER_NOT_EXIST);
        }

        return user.storages.map((storage) => ({ id: storage.id, name: storage.name }));
    }

    async addShelf(dto: CreateShelfDto): Promise<typeof ResponseMessages.SUCCESS_SHELF_CREATE> {
        const storage = await this.findById(dto.storageId);

        const shelf = await this.shelvesService.create(dto);

        await storage.$add("shelves", shelf);

        return ResponseMessages.SUCCESS_SHELF_CREATE;
    }

    async getShelves(storageId: number): Promise<Shelf[]> {
        const storage = await this.findById(storageId, { include: Shelf });

        if (!storage) {
            throw new NotFoundException(AppError.STORAGE_NOT_FOUND);
        }

        return storage.shelves;
    }
}
