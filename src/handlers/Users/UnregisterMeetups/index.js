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
    const errorMap = {
      "Database error - Failed to remove registration": 500,
      "Cannot unregister from past meetups": 400,
      "Meetup not found": 404,
      "User is not registered for this meetup": 404,
    };

    const statusCode = errorMap[error.message] || 500;
    const message = error.message || "Internal server error";

    return sendError(statusCode, message);
  }
};

export const handler = middy(unregisterHandler).use(validateToken);
