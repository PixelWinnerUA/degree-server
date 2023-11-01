import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";

import { Request } from "../common/interfaces/common.interfaces";

import { ShelvesService } from "../modules/shelves/shelves.service";
import { StoragesGuard } from "./storages.guard";
import { AppError } from "../common/constants/errors.constants";
import { HttpMethod } from "../common/enums/api.enums";

@Injectable()
export class ShelvesGuard implements CanActivate {
    constructor(
        private readonly storagesGuard: StoragesGuard,
        private readonly shelvesService: ShelvesService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const userId: number = request.user.id;
        const shelfId: number | undefined = request.body.id || +request.params.id;

        const isUsesStorageId = request.method === HttpMethod.GET || request.method === HttpMethod.POST;

        if (isUsesStorageId) {
            const storageId = request.body.storageId || +request.params.storageId;

            if (!storageId) {
                throw new BadRequestException(AppError.WRONG_DATA);
            }

            return await this.storagesGuard.checkStorageAccess(userId, storageId);
        }

        return await this.checkShelfAccess(userId, shelfId);
    }

    async checkShelfAccess(userId: number, shelfId: number | undefined): Promise<boolean> {
        const shelf = await this.shelvesService.findById(shelfId);

        if (!shelf) {
            throw new NotFoundException(AppError.SHELF_NOT_FOUND);
        }

        const hasAccessToStorage = await this.storagesGuard.checkStorageAccess(userId, shelf.storageId);

        if (!hasAccessToStorage) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        return hasAccessToStorage;
    }
}
