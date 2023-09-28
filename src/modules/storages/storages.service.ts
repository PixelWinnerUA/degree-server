import { Injectable } from "@nestjs/common";
import { CreateStorageDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Storage } from "./models/storages.model";
import { UserStorage } from "./models/user-storage.model";
import { ResponseMessages } from "../../common/constants/messages.constants";

@Injectable()
export class StoragesService {
    constructor(
        @InjectModel(Storage) private storageRepository: typeof Storage,
        @InjectModel(UserStorage) private userStorageRepository: typeof UserStorage
    ) {}

    async create(dto: CreateStorageDto, userId: number) {
        const storage = await this.storageRepository.create(dto);

        const userStorage = {
            userId,
            storageId: storage.id
        };

        await this.userStorageRepository.create(userStorage);

        return ResponseMessages.STORAGE_CREATED;
    }

    async getStoragesByUserId(userId: number) {
        const userStorages = await UserStorage.findAll({
            where: { userId },
            include: [Storage]
        });

        return userStorages.map((userStorage) => userStorage.storage);
    }
}
