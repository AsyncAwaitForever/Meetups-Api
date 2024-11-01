import middy from "@middy/core";
import { signupUser } from "../../../services/userService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { signupSchema } from "../../../utils/validationUtils";

const signupHandler = async (event) => {
  try {
    const { email, password, username } = event.body;

    const user = await signupUser(email, password, username);

    return sendSuccessResponse(201, {
      message: `User with email: ${user.email} created successfully`,
    });
  } catch (error) {
    if (error.message.includes("User with e-mail")) {
      return sendError(409, "This e-mail is already registered");
    }
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to create user");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(signupHandler).use(
  validationMiddleware(signupSchema)
);
