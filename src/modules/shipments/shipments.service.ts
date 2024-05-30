import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Shipment } from "./models/shipments.model";
import { CreateShipmentDto, GetShipmentsDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { AppError } from "../../common/constants/errors.constants";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import { Product } from "../products/models/products.model";
import { ShipmentProducts } from "./models/shipment-products.model";
import { Supplier } from "../suppliers/models/suppliers.model";

@Injectable()
export class ShipmentsService {
    constructor(
        @InjectModel(Shipment) private shipmentRepository: typeof Shipment,
        @InjectModel(ShipmentProducts) private shipmentProductsRepository: typeof ShipmentProducts,
        @InjectModel(Product) private productRepository: typeof Product,
        private readonly sequelize: Sequelize
    ) {
    }

    async findById(id: number): Promise<Shipment> {
        return await this.shipmentRepository.findByPk(id);
    }

    async create(createShipmentDto: CreateShipmentDto): Promise<SuccessMessageResponse> {
        const { name, surname, patronymic, address, email, phoneNumber, products } = createShipmentDto;

        const transaction = await this.sequelize.transaction();

        try {
            const shipment = await this.shipmentRepository.create({ name, surname, patronymic, address, email, phoneNumber }, { transaction });

            for (const product of products) {
                const { productId, amount } = product;

                const existingProduct = await this.productRepository.findByPk(productId, { transaction });

                if (!existingProduct) {
                    throw new BadRequestException(AppError.PRODUCT_NOT_FOUND);
                }

                if (existingProduct.amount < amount) {
                    throw new BadRequestException(AppError.WRONG_PRODUCT_AMOUNT_FOR_SHIPMENT);
                }

                existingProduct.amount -= amount;

                await existingProduct.save({ transaction });

                await this.shipmentProductsRepository.create(
                    {
                        shipmentId: shipment.id,
                        productId,
                        amount
                    },
                    { transaction }
                );
            }

            await transaction.commit();

            return getResponseMessageObject(ResponseMessages.SUCCESS_SHIPMENT_CREATE);
        } catch (error) {
            await transaction.rollback();
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAll(dto: GetShipmentsDto): Promise<Shipment[]> {
        const { startDate, endDate } = dto;

        const whereCondition = {
            createdAt: { [Op.between]: [startDate, endDate] }
        };

        return await this.shipmentRepository.findAll({
            where: whereCondition,
            include: [
                {
                    model: Product,
                    include: [Shipment, Supplier]
                }
            ]
        });
    }

    async delete(id: number): Promise<SuccessMessageResponse> {
        const transaction = await this.sequelize.transaction();

        try {
            const shipment = await this.shipmentRepository.findByPk(id, {
                include: [ShipmentProducts],
                transaction
            });

            if (!shipment) {
                throw new BadRequestException(AppError.SHIPMENT_NOT_FOUND);
            }

            for (const shipmentProduct of shipment.products) {
                const product = await this.productRepository.findByPk(shipmentProduct.id, { transaction });

                if (!product) {
                    throw new BadRequestException(AppError.PRODUCT_NOT_FOUND);
                }

                product.amount += shipmentProduct.amount;

                await product.save({ transaction });
                await shipmentProduct.destroy({ transaction });
            }

            await shipment.destroy({ transaction });
            await transaction.commit();

            return getResponseMessageObject(ResponseMessages.SUCCESS_SHIPMENT_DELETE);
        } catch (error) {
            await transaction.rollback();
            throw new InternalServerErrorException(error.message);
        }
    }
}
