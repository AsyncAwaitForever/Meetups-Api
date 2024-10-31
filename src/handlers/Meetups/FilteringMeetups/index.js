import middy from "@middy/core";
import { queryMeetupsWithOptions } from "../../../services/meetupService";
import { sendResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { querySchema } from "../../../utils/validationUtils";

const queryHandler = async (event) => {
  try {
    const options = event.queryStringParameters || {};

    const queryResult = await queryMeetupsWithOptions(options);
    return sendResponse(200, { meetups: queryResult });
  } catch (error) {
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to filter meetups");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(queryHandler).use(
  validationMiddleware(querySchema, "query")
);
// .use(validateToken);   // we can use auth on this function
