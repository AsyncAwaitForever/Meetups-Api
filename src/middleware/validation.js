import { sendError } from "../utils/apiResponses";
import { validate } from "../utils/validationUtils";

export const validationMiddleware = (schema, type = "body") => ({
  before: async (handler) => {
    try {
      let dataToValidate;

      if (type === "query") {
        dataToValidate = {
          queryStringParameters: handler.event.queryStringParameters || {},
        };
      } else {
        dataToValidate =
          typeof handler.event.body === "string"
            ? JSON.parse(handler.event.body)
            : handler.event.body;
      }
      const validatedData = await validate(schema, dataToValidate);

      if (type === "query") {
        handler.event.queryStringParameters =
          validatedData.queryStringParameters;
      } else {
        handler.event.body = validatedData;
      }
    } catch (error) {
      try {
        const errorMessages = JSON.parse(error.message);

        const formattedError = errorMessages
          .map((err) => `${err.field}: ${err.message}`)
          .join(". ");
        return sendError(400, `Validation failed. ${formattedError}`);
      } catch {
        return sendError(400, error.message);
      }
    }
  },
});
