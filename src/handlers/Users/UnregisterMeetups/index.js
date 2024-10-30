import { removeRegistration } from "../../../services/registrationService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";


const unregisterHandler = async (event) => {
  try {

    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId

    if (!meetupId || !userId) {
        return sendError(400, "meetupId and userId are required");
    }

    await removeRegistration(meetupId, userId);

    return sendSuccessResponse(200, { message: "User unregistered to meetup" });
  } catch (error) {
    console.error("Error in registration handler:", error);
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to unregister for the meetup");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(unregisterHandler).use(validateToken)