import middy from "@middy/core";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticateUser } from "../../../middlewares/authentication.mjs";
import { authorizeUser } from "../../../middlewares/authorize.mjs";
import { deleteMessage } from "../../../services/messages.mjs";

export const handler = middy (async (event) => {
  const { id } = event.pathParameters;

  await deleteMessage(id);
  

  return sendResponse(200,{
    success : true,
    message : "Message deleted successfully!"
  });
}).use(authenticateUser())
  .use(authorizeUser())
  .use(errorHandler());
