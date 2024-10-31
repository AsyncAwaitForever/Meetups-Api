import middy from "@middy/core";
import { getUserHistory } from "../../../services/userService";
import { sendResponse } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";

const profileHandler = async (event) => {
  try {
    const userId = event.userId;
    const userData = await getUserHistory(userId);

    return sendResponse(200, { profile: userData });
  } catch (error) {
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to fetch user");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(profileHandler).use(validateToken);
