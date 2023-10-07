import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";

import { Request } from "../common/interfaces/common.interfaces";
import { StoragesService } from "../modules/storages/storages.service";
import { AppError } from "../common/constants/errors.constants";

@Injectable()
export class StoragesGuard implements CanActivate {
    constructor(private readonly storagesService: StoragesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const userId = request.user.id;
        const storageId = request.body.storageId || request.body.id || +request.params.id;

        if (!storageId) {
            throw new NotFoundException(AppError.STORAGE_NOT_FOUND);
        }

        const storage = await this.storagesService.findById(storageId);

        if (!storage) {
            throw new NotFoundException(AppError.STORAGE_NOT_FOUND);
        }

        const hasAccess = await this.storagesService.userHasAccessToStorage(userId, storageId);

        if (!hasAccess) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        return hasAccess;
    }
}
