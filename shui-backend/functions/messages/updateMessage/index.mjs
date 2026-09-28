import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateBody } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authentication.mjs';
import { authorizeUser } from '../../../middlewares/authorize.mjs';
import { messageSchema } from '../../../models/messageSchema.mjs';
import { updateMessage } from '../../../services/messages.mjs';

export const handler = middy(async (event) => {
  
  const { id } = event.pathParameters;
  const { text } = event.body;

  const Attributes = await updateMessage(id, text);

  // Only return the message fields, not the database keys
  const { username, createdAt, updatedAt } = Attributes;

  return sendResponse(200, {
    success : true,
    message : { id, username, text, createdAt, updatedAt }
  });
}).use(httpJsonBodyParser())
  .use(authenticateUser())
  .use(authorizeUser())
  .use(validateBody(messageSchema))
  .use(errorHandler());
