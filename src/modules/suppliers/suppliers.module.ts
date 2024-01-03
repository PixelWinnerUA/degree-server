import { Module } from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Supplier } from "./models/suppliers.model";
import { Product } from "../products/models/products.model";
import { ShelvesModule } from "../shelves/shelves.module";

@Module({
    imports: [SequelizeModule.forFeature([Supplier, Product]), ShelvesModule],
    controllers: [SuppliersController],
    providers: [SuppliersService],
    exports: [SuppliersService]
})
export class SuppliersModule {}
