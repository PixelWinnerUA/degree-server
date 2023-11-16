import { BadRequestException, Injectable } from "@nestjs/common";
import { Shelf } from "./models/shelves.model";
import { CreateShelfDto, DeleteShelfDto, UpdateShelfDto } from "./dto";
import { InjectModel } from "@nestjs/sequelize";
import { FindOptions } from "sequelize";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { getResponseMessageObjectHelper } from "../../common/helpers/getResponseMessageObject.helper";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { StoragesService } from "../storages/storages.service";
import { AppError } from "../../common/constants/errors.constants";

@Injectable()
export class ShelvesService {
    constructor(
        @InjectModel(Shelf) private shelfRepository: typeof Shelf,
        private readonly storagesService: StoragesService
    ) {}

    async create(dto: CreateShelfDto): Promise<SuccessMessageResponse> {
        const storage = await this.storagesService.findById(dto.storageId);
        const shelf = await this.shelfRepository.create(dto);

        await storage.$add("shelves", shelf);

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_SHELF_CREATE);
    }

    async findById(shelfId: number, options?: Omit<FindOptions<Shelf>, "where">): Promise<Shelf> {
        return await this.shelfRepository.findByPk(shelfId, options);
    }

    async getAll(storageId: number): Promise<Shelf[]> {
        return await this.shelfRepository.findAll({ where: { storageId } });
    }

    async update(dto: UpdateShelfDto): Promise<SuccessMessageResponse> {
        const { id, name } = dto;
        const shelf = await this.findById(id);
        shelf.name = name;

        try {
            await shelf.save();
        } catch (e) {
            throw new BadRequestException(AppError.SHELF_UPDATE_ERROR);
        }

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_SHELF_UPDATE);
    }

    async delete(dto: DeleteShelfDto): Promise<SuccessMessageResponse> {
        const shelf = await this.findById(dto.id);

        await shelf.destroy();

        return getResponseMessageObjectHelper(ResponseMessages.SUCCESS_SHELF_DELETE);
    }
}
