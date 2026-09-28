import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
    onError : (handler) => {
        const { error } = handler;
        handler.response = sendResponse(
            error.statusCode || 500,
            {
                success : false,
                message : error.message || 'Internal Server Error!'
            }
        );
    }
})