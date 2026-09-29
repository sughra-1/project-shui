import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { getMessages } from '../../../services/messages.mjs';

export const handler = middy(async (event) => {
  //Get messages by username
  const username = event.queryStringParameters?.username;

  const Items = await getMessages(username);

  // Only return the message fields, not the database keys
  const messages = Items.map(({ id, username, text, createdAt, updatedAt }) => ({ id, username, text, createdAt, updatedAt }));

  return sendResponse(200, {
    success : true,
    messages : messages
  });
}).use(errorHandler());
