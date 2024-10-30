import { removeRegistration } from "../../../services/registrationService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";

const unregisterHandler = async (event) => {
  try {
    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId;

    if (!meetupId) {
      return sendError(400, "meetupId is required");
    }
    if (!event.userId) {
      return sendError(401, "User not authenticated");
    }

    const data = await removeRegistration(meetupId, userId);

    return sendSuccessResponse(200, {
      message: `Successfully unregistered from meetup id:${data.meetupId}`,
    });
  } catch (error) {
    if (error.message === "Meetup not found") {
      return sendError(404, "Meetup not found");
    }
    if (error.message.includes("not registered for this meetup")) {
      return sendError(400, "User is not registered for this meetup");
    }
    if (error.message.includes("Database error")) {
      return sendError(
        500,
        "Database error, failed to unregister for the meetup"
      );
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(unregisterHandler).use(validateToken);
