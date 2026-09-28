import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateBody } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authentication.mjs';
import { messageSchema } from '../../../models/messageSchema.mjs';
import { createMessage } from '../../../services/messages.mjs';


export const handler = middy(async (event) => {
  const { text } = event.body;       // validate by messageSchema
  const { username } = event.user;   // comes from the token, not the body

  const message = await createMessage(username, text);

  return sendResponse(201, {
    success : true,
    message : message
  });
}).use(httpJsonBodyParser())
  .use(authenticateUser())
  .use(validateBody(messageSchema))
  .use(errorHandler());

