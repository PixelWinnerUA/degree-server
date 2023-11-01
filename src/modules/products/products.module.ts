import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./models/products.model";
import { ShelvesModule } from "../shelves/shelves.module";

@Module({
    imports: [SequelizeModule.forFeature([Product]), ShelvesModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService]
})
export class ProductsModule {}
