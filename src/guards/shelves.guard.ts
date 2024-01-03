import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Request } from "../common/interfaces/common.interfaces";

import { StoragesGuard } from "./storages.guard";
import { AppError } from "../common/constants/errors.constants";
import { HttpMethod } from "../common/enums/api.enums";
import { Shelf } from "../modules/shelves/models/shelves.model";
import { Storage } from "../modules/storages/models/storages.model";
import { UserStorage } from "../modules/storages/models/user-storage.model";
import { User } from "../modules/users/models/users.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class ShelvesGuard implements CanActivate {
    constructor(
        private readonly storagesGuard: StoragesGuard,
        @InjectModel(Shelf) private shelfRepository: typeof Shelf
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const userId: number = request.user.id;
        const shelfId: number | undefined = request.body.id || +request.params.id;

        const isUsesStorageId = request.method === HttpMethod.GET || request.method === HttpMethod.POST;

        if (isUsesStorageId) {
            const storageId = request.body.storageId || +request.params.storageId;

            return await this.storagesGuard.checkStorageAccess(userId, storageId);
        }

        return await this.checkShelfAccess(userId, shelfId);
    }

    async checkShelfAccess(userId: number, shelfId: number | undefined): Promise<boolean> {
        const shelf = await this.shelfRepository.findOne({
            where: { id: shelfId },
            include: [
                {
                    model: Storage,
                    attributes: ["id"],
                    required: true,
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
                }
            ]
        });

        if (!shelf) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        return !!shelf;
    }
}
