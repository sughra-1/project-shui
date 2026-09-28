import createError from 'http-errors';
import { verifyToken } from '../utils/token.mjs';

export const authenticateUser = () => ({
    before : (handler) => {
        const token = handler.event.headers.Authorization || handler.event.headers.authorization;
        if (!token) {
            throw createError(401, { message : 'Unauthorized: No token provided'});
        }
    
        try {
            const decoded = verifyToken(token.split(' ')[1]); 
            handler.event.user = decoded;
        } catch (error) {
            
            throw createError(401, { message : 'Unauthorized: Invalid token'});
        }
    }
});