import middy from "@middy/core";
import { queryMeetupsWithOptions } from "../../../services/meetupService";
import { sendResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { querySchema } from "../../../utils/validationUtils";
import validateToken from "../../../middleware/auth";

const queryHandler = async (event) => {
  try {
    const filteringOptions = event.queryStringParameter || {};

    const queryResult = await queryMeetupsWithOptions(filteringOptions);
    return sendResponse(200, { meetups: queryResult });
  } catch (error) {
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to filter meetups");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(queryHandler)
  .use(validationMiddleware(querySchema))
  .use(validateToken);