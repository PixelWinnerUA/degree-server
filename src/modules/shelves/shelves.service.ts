import { Injectable } from "@nestjs/common";
import { Shelf } from "./models/shelves.model";
import { CreateShelfDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { CreateProductDto } from "../products/dto";
import { FindOptions } from "sequelize";
import { ProductsService } from "../products/products.service";
import { ResponseMessages } from "../../common/constants/messages.constants";

@Injectable()
export class ShelvesService {
    constructor(
        @InjectModel(Shelf) private shelfRepository: typeof Shelf,
        private readonly productsService: ProductsService
    ) {}

    async create(dto: CreateShelfDto): Promise<Shelf> {
        return await this.shelfRepository.create(dto);
    }

    async findById(shelfId: number, options?: Omit<FindOptions<Shelf>, "where">): Promise<Shelf> {
        return await this.shelfRepository.findByPk(shelfId, options);
    }
    //ADD GUARD
    async addProduct(dto: CreateProductDto) {
        const shelf = await this.findById(dto.shelfId);

        const product = await this.productsService.create(dto);

        await shelf.$add("products", product);

        return ResponseMessages.SUCCESS_PRODUCT_CREATE;
    }
}
