import { SuccessMessageResponse } from "../interfaces/common.interfaces";

export const getResponseMessageObjectHelper = (message: SuccessMessageResponse["message"]): SuccessMessageResponse => ({
    message
});
