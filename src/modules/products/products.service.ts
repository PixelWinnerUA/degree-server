import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./models/products.model";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product) private productRepository: typeof Product) {}

    async create(dto: CreateProductDto) {
        return await this.productRepository.create(dto);
    }
}
