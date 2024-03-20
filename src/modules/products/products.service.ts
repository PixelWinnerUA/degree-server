import { BadRequestException, Injectable } from "@nestjs/common";
import {
    AddArchiveRecordDto,
    CreateProductDto,
    DeleteArchivedRecordDto,
    DeleteProductDto,
    GetAllProductsDto,
    GetArchivedProductsDto,
    UpdateProductDto
} from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./models/products.model";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ShelvesService } from "../shelves/shelves.service";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { FindOptions, Op } from "sequelize";
import { AppError } from "../../common/constants/errors.constants";
import { omit } from "lodash";
import { ExtendedSearchProduct, GetAllProductsResponse } from "./response";
import { Shelf } from "../shelves/models/shelves.model";
import { Storage } from "../storages/models/storages.model";
import { SuppliersService } from "../suppliers/suppliers.service";
import { Supplier } from "../suppliers/models/suppliers.model";
import { UserStorage } from "../storages/models/user-storage.model";
import { User } from "../users/models/users.model";

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productRepository: typeof Product,
        private readonly shelvesService: ShelvesService,
        private readonly suppliersService: SuppliersService
    ) {}

    async create(dto: CreateProductDto): Promise<SuccessMessageResponse> {
        const shelf = await this.shelvesService.findById(dto.shelfId);
        const supplier = await this.suppliersService.createSupplier(dto.supplier);

        const extendedDto = { ...dto, supplierId: supplier.id, initialAmount: dto.amount };

        const product = await this.productRepository.create(extendedDto);

        await shelf.$add("products", product);

        return getResponseMessageObject(ResponseMessages.SUCCESS_PRODUCT_CREATE);
    }

    async findById(productId: number, options?: Omit<FindOptions<Product>, "where">): Promise<Product> {
        return await this.productRepository.findByPk(productId, options);
    }

    async getAll({ shelfId, page, limit, name = "" }: GetAllProductsDto): Promise<GetAllProductsResponse> {
        const offset = (page - 1) * limit;

        const whereCondition = {
            shelfId,
            amount: { [Op.gt]: 0 }
        };

        if (name) {
            Object.assign(whereCondition, { name: { [Op.like]: `%${name}%` } });
        }

        const totalProducts = await this.productRepository.count({ where: whereCondition });
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await this.productRepository.findAll({
            where: whereCondition,
            limit,
            offset,
            include: [Supplier]
        });

        return { products, totalPages, totalProducts };
    }

    async getArchived({ page, limit, name = "" }: GetArchivedProductsDto, userId: number): Promise<GetAllProductsResponse> {
        const offset = (page - 1) * limit;
        const whereCondition = {
            archiveRecords: {
                [Op.and]: [{ [Op.ne]: null }, { [Op.not]: "[]" }]
            }
        };

        if (name) {
            Object.assign(whereCondition, { name: { [Op.like]: `%${name}%` } });
        }

        const userStorageCondition = {
            model: Shelf,
            required: true,
            include: [
                {
                    model: Storage,
                    required: true,
                    include: [
                        {
                            model: UserStorage,
                            required: true,
                            where: { userId },
                            include: [
                                {
                                    model: User,
                                    attributes: [],
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const totalProducts = await this.productRepository.count({
            where: whereCondition,
            include: [userStorageCondition]
        });
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await this.productRepository.findAll({
            where: whereCondition,
            limit,
            offset,
            include: [Supplier, userStorageCondition]
        });

        const omittedProducts = products.map((product) => omit(product.toJSON(), "shelf")) as Product[];

        return { products: omittedProducts, totalPages, totalProducts };
    }

    async update(dto: UpdateProductDto): Promise<SuccessMessageResponse> {
        const product = await this.productRepository.findOne({ where: { id: dto.id } });

        if (!product) {
            throw new BadRequestException(AppError.PRODUCT_NOT_FOUND);
        }

        Object.assign(product, omit(dto, "id"));

        await product.save();

        return getResponseMessageObject(ResponseMessages.SUCCESS_PRODUCT_UPDATE);
    }

    async delete(dto: DeleteProductDto): Promise<SuccessMessageResponse> {
        const product = await this.findById(dto.id);

        await product.destroy();

        return getResponseMessageObject(ResponseMessages.SUCCESS_PRODUCT_DELETE);
    }

    async searchByName(productName: string): Promise<ExtendedSearchProduct[]> {
        const extendedProducts = await this.productRepository.findAll({
            where: {
                name: { [Op.like]: `%${productName}%` }
            },
            include: [
                {
                    model: Shelf,
                    attributes: ["name"],
                    include: [
                        {
                            model: Storage,
                            attributes: ["id", "name"]
                        }
                    ]
                },
                {
                    model: Supplier
                }
            ]
        });

        return extendedProducts.map((product) => {
            const productJSON = product.toJSON();

            return {
                ...omit(productJSON, ["shelf"]),
                shelfName: productJSON.shelf?.name,
                storageId: productJSON.shelf?.storage?.id,
                storageName: productJSON.shelf?.storage?.name
            };
        });
    }

    async archive(dto: AddArchiveRecordDto): Promise<SuccessMessageResponse> {
        const { productId, ...archiveRecord } = dto;

        const product = await this.findById(productId);

        product.amount = product.amount - archiveRecord.amount;

        if (product.amount < 0) {
            throw new BadRequestException(AppError.ARCHIVE_ERROR);
        }

        if (!product.archiveRecords) {
            product.archiveRecords = [archiveRecord];
        } else {
            product.archiveRecords = [...product.archiveRecords, archiveRecord];
        }

        await product.save();

        return getResponseMessageObject(ResponseMessages.SUCCESS_ARCHIVE);
    }

    async deleteArchiveRecord(dto: DeleteArchivedRecordDto): Promise<SuccessMessageResponse> {
        const { productId, ...archiveRecord } = dto;

        const product = await this.findById(productId);

        product.archiveRecords = product.archiveRecords.filter((record) => record.date !== archiveRecord.date);

        product.amount = product.amount + archiveRecord.amount;

        await product.save();

        return getResponseMessageObject(ResponseMessages.SUCCESS_UNARCHIVE);
    }
}
