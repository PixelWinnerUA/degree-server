import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { User } from "../../users/models/users.model";
import { Storage } from "../models/storages.model";

export class GetStorageResponse {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;

    @ApiProperty({ example: "Address 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    address: string;

    @ApiProperty({ example: "Date string object" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    createdAt: string;
}

export class GetStorageInfoResponse {
    @ApiProperty({ example: "Storage info" })
    storage: Storage;

    @ApiProperty({ example: "Storage users" })
    users: User[];
}
