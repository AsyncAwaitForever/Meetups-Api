import { sendError } from "../utils/apiResponses";
import { validate } from "../utils/validationUtils";

export const validationMiddleware = (schema) => ({
  before: async (handler) => {
    try {
      const body =
        typeof handler.event.body === "string"
          ? JSON.parse(handler.event.body)
          : handler.event.body;

      const validatedBody = await validate(schema, body);

      handler.event.body = validatedBody;
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
