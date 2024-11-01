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
      "Meetup not found": 404,
      "Cannot unregister from past meetups": 400,
      "User is not registered for this meetup": 404,
      "Database error - failed to remove registration": 500,
      "Database error - failed to complete unregistration": 500,
    };

    const statusCode = errorMap[error.message] || 500;
    const message = error.message || "Internal server error";

    return sendError(statusCode, message);
  }
};

export const handler = middy(unregisterHandler).use(validateToken);
