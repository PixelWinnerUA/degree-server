import { Module } from "@nestjs/common";
import { ShelvesService } from "./shelves.service";
import { ShelvesController } from "./shelves.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Storage } from "../storages/models/storages.model";
import { Shelf } from "./models/shelves.model";
import { ProductsModule } from "../products/products.module";

@Module({
    imports: [SequelizeModule.forFeature([Shelf, Storage]), ProductsModule],
    controllers: [ShelvesController],
    providers: [ShelvesService],
    exports: [ShelvesService]
})
export class ShelvesModule {}
