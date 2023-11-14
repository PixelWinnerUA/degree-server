import { HookReturn } from "sequelize/types/hooks";
import { Shelf } from "../models/shelves.model";

export const ShelfHooks = {
    beforeCreate: (shelf: Shelf): HookReturn => {
        shelf.maxVolume = shelf.length * shelf.width * shelf.height;
        shelf.availableVolume = shelf.maxVolume;
        shelf.availableWeight = shelf.maxWeight;
    },

    beforeUpdate: (shelf: Shelf): HookReturn => {
        if (shelf.changed("length") || shelf.changed("width") || shelf.changed("height")) {
            shelf.maxVolume = shelf.length * shelf.width * shelf.height;
        }
    }
};
