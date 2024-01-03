import { Request as ExpressRequest } from "express";
import { ResponseMessages } from "../constants/messages.constants";

export interface Request extends ExpressRequest {
    user: { id: number };
}

export interface IJwtToken {
    id: number;
    iat: number;
    exp: number;
}

export interface SuccessMessageResponse {
    message: (typeof ResponseMessages)[keyof typeof ResponseMessages];
}
