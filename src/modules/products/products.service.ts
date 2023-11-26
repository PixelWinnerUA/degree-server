import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto, DeleteProductDto, UpdateProductDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./models/products.model";
import { getResponseMessageObjectHelper } from "../../common/helpers/getResponseMessageObject.helper";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ShelvesService } from "../shelves/shelves.service";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { FindOptions } from "sequelize";
import { AppError } from "../../common/constants/errors.constants";
import { omit } from "lodash";
import { GetAllProductsResponse } from "./response";

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

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_PRODUCT_CREATE);
    }

    async findById(productId: number, options?: Omit<FindOptions<Product>, "where">): Promise<Product> {
        return await this.productRepository.findByPk(productId, options);
    }

    async getAll(shelfId: number, page: number, limit: number): Promise<GetAllProductsResponse> {
        const offset = (page - 1) * limit;

        const totalProducts = await this.productRepository.count({ where: { shelfId } });
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await this.productRepository.findAll({
            where: { shelfId },
            limit,
            offset
        });

        return { products, totalPages, totalProducts };
    }

    async update(dto: UpdateProductDto): Promise<SuccessMessageResponse> {
        const product = await this.productRepository.findOne({ where: { id: dto.id } });

        if (!product) {
            throw new BadRequestException(AppError.PRODUCT_NOT_FOUND);
        }

        Object.assign(product, omit(dto, "id"));

        await product.save();

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_PRODUCT_UPDATE);
    }

    async delete(dto: DeleteProductDto): Promise<SuccessMessageResponse> {
        const product = await this.findById(dto.id);

        await product.destroy();

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_PRODUCT_DELETE);
    }
}
