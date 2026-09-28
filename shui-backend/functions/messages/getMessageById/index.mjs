import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { getMessageById } from '../../../services/messages.mjs';

export const handler = middy(async (event) => {
  // get id from the URL: /api/messages/{id}
  const { id } = event.pathParameters;
  const Item = await getMessageById(id);

  // Only return the message fields, not the database keys
  const { username, text, createdAt } = Item;

  return sendResponse(200, {
    success : true,
    message : { id, username, text, createdAt }
  });
}).use(errorHandler());
