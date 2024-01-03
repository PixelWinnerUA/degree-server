import { SuccessMessageResponse } from "../interfaces/common.interfaces";

export const getResponseMessageObject = (message: SuccessMessageResponse["message"]): SuccessMessageResponse => ({
    message
});
