import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./models/products.model";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ShelvesService } from "../shelves/shelves.service";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { FindOptions } from "sequelize";

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productRepository: typeof Product,
        private readonly shelvesService: ShelvesService
    ) {}

    async create(dto: CreateProductDto): Promise<SuccessMessageResponse> {
        const shelf = await this.shelvesService.findById(dto.shelfId);
        const product = await this.productRepository.create(dto);
        await shelf.$add("products", product);

        return getResponseMessageObject(ResponseMessages.SUCCESS_PRODUCT_CREATE);
    }

    async findById(productId: number, options?: Omit<FindOptions<Product>, "where">): Promise<Product> {
        return await this.productRepository.findByPk(productId, options);
    }

    async getAll(shelfId: number): Promise<Product[]> {
        return await this.productRepository.findAll({ where: { shelfId } });
    }
}
