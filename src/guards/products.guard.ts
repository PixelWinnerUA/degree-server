import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Request } from "../common/interfaces/common.interfaces";

import { AppError } from "../common/constants/errors.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "../modules/products/models/products.model";
import { Shelf } from "../modules/shelves/models/shelves.model";
import { User } from "../modules/users/models/users.model";
import { UserStorage } from "../modules/storages/models/user-storage.model";
import { Storage } from "../modules/storages/models/storages.model";

@Injectable()
export class ProductsGuard implements CanActivate {
    constructor(@InjectModel(Product) private productRepository: typeof Product) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const userId: number = request.user.id;
        const productId: number | undefined = request.body.id || +request.params.id;

        return await this.checkProductAccess(userId, productId);
    }

    async checkProductAccess(userId: number, productId: number | undefined): Promise<boolean> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            include: [
                {
                    model: Shelf,
                    attributes: ["id"],
                    required: true,
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
                }
            ]
        });

        if (!product) {
            throw new BadRequestException(AppError.NO_ACCESS);
        }

        return !!product;
    }
}
