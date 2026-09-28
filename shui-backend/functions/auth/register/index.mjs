import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateBody } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { registerSchema } from '../../../models/userSchema.mjs';
import { createUser } from '../../../services/users.mjs';

export const handler = middy(async (event) => {
  const { username, email, password } = event.body;

  await createUser(username, email, password);

  return sendResponse(201, {
    success : true,
    message : 'User registered successfully!'
  });
}).use(httpJsonBodyParser())
  .use(validateBody(registerSchema))
  .use(errorHandler());
