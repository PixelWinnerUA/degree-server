import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

import { CreateSupplierDto, CreateSupplyDto, GetStatisticsDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { Supplier } from "./models/suppliers.model";
import { Sequelize } from "sequelize-typescript";
import { Op, Transaction } from "sequelize";
import { Product } from "../products/models/products.model";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ShelvesService } from "../shelves/shelves.service";
import { AppError } from "../../common/constants/errors.constants";
import { Shelf } from "../shelves/models/shelves.model";

@Injectable()
export class SuppliersService {
    constructor(
        @InjectModel(Supplier) private supplierRepository: typeof Supplier,
        @InjectModel(Product) private productRepository: typeof Product,
        private readonly shelvesService: ShelvesService,
        private readonly sequelize: Sequelize
    ) {}

    async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
        return await this.supplierRepository.create(dto);
    }

    async findExistSupplier(supplierDto: CreateSupplierDto): Promise<Supplier | undefined> {
        return await this.supplierRepository.findOne({
            where: { ...supplierDto }
        });
    }

    async createSupply(dto: CreateSupplyDto, userId: number): Promise<SuccessMessageResponse> {
        const { products, ...supplierDto } = dto;

        const transaction = await this.sequelize.transaction();

        try {
            const supplier = (await this.findExistSupplier(supplierDto)) ?? (await this.createSupplier(supplierDto));

            for (const product of products) {
                const supplyProduct = { ...product, supplierId: supplier.id } as Product;

                await this.placeProductOnShelf({ userId, product: supplyProduct, transaction });
            }

            await transaction.commit();

            return getResponseMessageObject(ResponseMessages.SUCCESS_SUPPLY_CREATE);
        } catch (error) {
            await transaction.rollback();
            throw new InternalServerErrorException(error.message);
        }
    }

    async getStatistics(dto: GetStatisticsDto) {
        const { startDate, endDate } = dto;

        return this.productRepository.findAll({ where: { createdAt: { [Op.between]: [startDate, endDate] } }, include: [Supplier] });
    }

    async placeProductOnShelf({ userId, product, transaction }: { userId: number; product: Product; transaction: Transaction }): Promise<void> {
        const shelves = await this.shelvesService.getShelvesByUserId(userId);

        let remainingVolume = product.length * product.width * product.height * product.amount;
        let remainingWeight = product.weightPerUnit * product.amount;

        for (const shelf of shelves) {
            const availableVolume = shelf.availableVolume;
            const availableWeight = shelf.availableWeight;

            const canFit = this.canProductFitOnShelf(product, shelf);

            if (canFit && availableVolume > 0 && availableWeight > 0) {
                const volumeToPlace = Math.min(availableVolume, remainingVolume);
                const weightToPlace = Math.min(availableWeight, remainingWeight);

                if (volumeToPlace > 0 && weightToPlace > 0) {
                    remainingVolume -= volumeToPlace;
                    remainingWeight -= weightToPlace;

                    shelf.availableVolume -= volumeToPlace;
                    shelf.availableWeight -= weightToPlace;

                    await shelf.save({ transaction });

                    const amountToPlace = this.calculateAmountFromVolumeAndWeight(product, volumeToPlace, weightToPlace);

                    await this.productRepository.create(
                        {
                            ...product,
                            shelfId: shelf.id,
                            amount: amountToPlace
                        },
                        { transaction, hooks: false }
                    );

                    if (remainingVolume <= 0 && remainingWeight <= 0) {
                        break;
                    }
                }
            }
        }

        if (remainingVolume > 0 || remainingWeight > 0) {
            throw new BadRequestException(AppError.SUPPLY_PRODUCT_PROPERTIES_ERROR);
        }
    }

    private calculateAmountFromVolumeAndWeight(product: Product, volumeToPlace: number, weightToPlace: number): number {
        const singleProductVolume = product.length * product.width * product.height;
        const singleProductWeight = product.weightPerUnit;

        const maxAmountByVolume = Math.floor(volumeToPlace / singleProductVolume);
        const maxAmountByWeight = Math.floor(weightToPlace / singleProductWeight);

        return Math.min(maxAmountByVolume, maxAmountByWeight);
    }

    private canProductFitOnShelf(product: Product, shelf: Shelf): boolean {
        const directFit = product.length <= shelf.length && product.width <= shelf.width && product.height <= shelf.height;

        const sideFit = product.height <= shelf.length && product.length <= shelf.width && product.width <= shelf.height;

        const verticalFit = product.width <= shelf.length && product.height <= shelf.width && product.length <= shelf.height;

        return directFit || sideFit || verticalFit;
    }
}
