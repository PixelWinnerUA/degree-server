import { Module } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { ShipmentsController } from "./shipments.controller";
import { Shipment } from "./models/shipments.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "../products/models/products.model";
import { ShipmentProducts } from "./models/shipment-products.model";

@Module({
    imports: [SequelizeModule.forFeature([Shipment, ShipmentProducts, Product])],
    controllers: [ShipmentsController],
    providers: [ShipmentsService],
    exports: [ShipmentsService]
})
export class ShipmentsModule {
}
