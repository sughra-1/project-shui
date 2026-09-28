/*import createError from 'http-errors';

export const authorizeUser = () => ({
    before : (handler) => {
        const { message, user} = handler.event;

        if (!message) {
            throw createError (404, { 
                message: 'Message not found'
            });
        }
        if( message.username !== user.username) {
            throw createError(403, 'Forbidden: You can only change your own messages');
        }
    }
})*/

import createError from 'http-errors';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../services/db.mjs';

// Checks that the message exists and belongs to the logged-in user.
// Must run after authenticateUser, which sets event.user.
export const authorizeUser = () => ({
    before : async (handler) => {
        const { id } = handler.event.pathParameters;
        const { user } = handler.event;

        // Fetch the message from DynamoDB
        const { Item } = await db.send(new GetCommand({
            TableName : process.env.TABLE_NAME,
            Key : { PK : `MESSAGE#${id}`, SK : 'METADATA' }
        }));

        if (!Item) {
            throw createError(404, { message : 'Message not found.' });
        }

        if (Item.username !== user.username) {
            throw createError(403, { message : 'You can only change your own messages.' });
        }

        // Save the message so the handler can use it
        handler.event.message = Item;
    }
});
