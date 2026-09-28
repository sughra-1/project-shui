import createError from 'http-errors';

export const validateBody = (schema) => ({
    before : (handler) => {
        const result = schema.safeParse(handler.event.body);
        if(!result.success) {
            throw createError(400, result.error.issues[0].message);
        }
        handler.event.body = result.data;
    }
})