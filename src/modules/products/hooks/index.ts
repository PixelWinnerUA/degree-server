import { HookReturn } from "sequelize/types/hooks";
import { Product } from "src/modules/products/models/products.model";
import { Sequelize } from "sequelize-typescript";
import { Shelf } from "../../shelves/models/shelves.model";

export const ProductHooks = {
    afterCreate: async (product: Product): Promise<HookReturn> => {
        const volume = product.length * product.height * product.width * product.amount;

        await Shelf.update(
            { availableVolume: Sequelize.literal(`maxVolume - ${volume}`) },
            {
                where: { id: product.shelfId }
            }
        );
    },
    afterUpdate: async (product: Product): Promise<HookReturn> => {
        if (product.changed("amount") || product.changed("length") || product.changed("width") || product.changed("height")) {
            const volume = product.length * product.height * product.width * product.amount;

            await Shelf.update(
                {
                    availableVolume: Sequelize.literal(`maxVolume - ${volume}`),
                    availableWeight: Sequelize.literal(`maxWeight - ${product.amount * product.weightPerUnit}`)
                },
                {
                    where: { id: product.shelfId }
                }
            );
        }
    }
};
