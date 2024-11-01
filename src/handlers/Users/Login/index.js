import middy from "@middy/core";
import { loginUser } from "../../../services/userService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validationMiddleware } from "../../../middleware/validation";
import { loginSchema } from "../../../utils/validationUtils";

const loginHandler = async (event) => {
  try {
    const { email, password } = event.body;

    const data = await loginUser(email, password);

    return sendSuccessResponse(200, {
      token: data.token,
      userId: data.user.userId,
    });
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid password"
    ) {
      return sendError(401, "Invalid credentials");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(loginHandler).use(
  validationMiddleware(loginSchema)
);
