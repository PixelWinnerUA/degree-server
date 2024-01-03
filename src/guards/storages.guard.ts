import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Request } from "../common/interfaces/common.interfaces";
import { AppError } from "../common/constants/errors.constants";
import { Storage } from "../modules/storages/models/storages.model";
import { UserStorage } from "../modules/storages/models/user-storage.model";
import { User } from "../modules/users/models/users.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class StoragesGuard implements CanActivate {
    constructor(@InjectModel(Storage) private storageRepository: typeof Storage) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const userId: number = request.user.id;
        const storageId: number | undefined = request.body.storageId || request.body.id || +request.params.id || +request.params.storageId;

        return await this.checkStorageAccess(userId, storageId);
    }

    async checkStorageAccess(userId: number, storageId: number | undefined): Promise<boolean> {
        const storage = await this.storageRepository.findOne({
            where: { id: storageId },
            include: [
                {
                    model: UserStorage,
                    attributes: ["id"],
                    required: true,
                    where: { userId: userId },
                    include: [
                        {
                            model: User,
                            attributes: ["id"],
                            required: true
                        }
                    ]
                }
            ]
        });

        if (!storage) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        return !!storage;
    }
}
