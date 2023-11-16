import { HookReturn } from "sequelize/types/hooks";
import { Product } from "src/modules/products/models/products.model";
import { Shelf } from "../../shelves/models/shelves.model";
import { BadRequestException } from "@nestjs/common";
import { AppError } from "../../../common/constants/errors.constants";

export const ProductHooks = {
    beforeCreate: async (product: Product): Promise<HookReturn> => {
        const volume = product.length * product.height * product.width * product.amount;
        const weight = product.weightPerUnit * product.amount;

        const shelf = await Shelf.findByPk(product.shelfId);

        shelf.availableVolume -= volume;
        shelf.availableWeight -= weight;

        if (shelf.availableWeight < 0 || shelf.availableVolume < 0) {
            throw new BadRequestException(AppError.SHELF_SUPPORT_ISSUE);
        }

        await shelf.save();
    },
    beforeUpdate: async (product: Product): Promise<HookReturn> => {
        if (product.changed("amount") || product.changed("length") || product.changed("width") || product.changed("height")) {
            const previous = await Product.findByPk(product.id);
            if (!previous) {
                throw new BadRequestException(AppError.PREVIOUS_PRODUCT_STATE_NOT_FOUND);
            }

            const shelf = await Shelf.findByPk(product.shelfId);
            if (!shelf) {
                throw new BadRequestException(AppError.SHELF_NOT_FOUND);
            }

            const deltaWeight = product.amount * product.weightPerUnit - previous.amount * previous.weightPerUnit;
            const deltaVolume =
                product.amount * product.length * product.width * product.height - previous.amount * previous.length * previous.width * previous.height;

            shelf.availableWeight -= deltaWeight;
            shelf.availableVolume -= deltaVolume;

            if (shelf.availableWeight < 0 || shelf.availableVolume < 0) {
                throw new BadRequestException(AppError.SHELF_SUPPORT_ISSUE);
            }

            await shelf.save();
        }
    },
    afterDestroy: async (product: Product): Promise<HookReturn> => {
        const volume = product.length * product.height * product.width * product.amount;
        const weight = product.weightPerUnit * product.amount;

        const shelf = await Shelf.findByPk(product.shelfId);

        shelf.availableVolume += volume;
        shelf.availableWeight += weight;

        await shelf.save();
    }
};
