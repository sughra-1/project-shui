import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { sendResponse } from '../../../responses/index.mjs';
import { validateBody } from '../../../middlewares/validation.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { loginSchema } from '../../../models/userSchema.mjs';
import { signToken, comparePassword } from '../../../utils/token.mjs';
import { getUserByUsername } from '../../../services/users.mjs';

  export const handler = middy(async (event) => {
    const body = event.body;

    //Get user by username
    const user = await getUserByUsername(body.username);
    if (!user || !(await comparePassword(body.password, user.password))) {
    return sendResponse(401, {
      success : false,
      message : 'Username and/or password are incorrect'
    });
  }

  return sendResponse(200, {
    success : true,
    message : 'User logged in successfully!',
    token : signToken({ 
      id : user.id, 
      username : user.username 
    })
  });

  }).use(httpJsonBodyParser())
    .use(validateBody(loginSchema))
    .use(errorHandler());

