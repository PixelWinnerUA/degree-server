import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { User } from "../../users/models/users.model";
import { Storage } from "../models/storages.model";

export class GetStorageInfoResponse {
    @ApiProperty({ example: "Storage info" })
    storage: Storage;

    @ApiProperty({ example: "Storage users" })
    users: User[];
}

class ShelvesListWithLimitedFields {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Shelf 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}

export class GetStorageShelfListResponse {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;

    shelves: ShelvesListWithLimitedFields[];
}
