import { Product } from "../models/products.model";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllProductsResponse {
    @ApiProperty({ example: 25 })
    totalProducts: number;
    @ApiProperty({ example: 5 })
    totalPages: number;
    @ApiProperty({ type: [Product] })
    products: Product[];
}
