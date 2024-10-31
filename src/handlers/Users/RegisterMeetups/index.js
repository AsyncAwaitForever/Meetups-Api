import { addRegistration } from "../../../services/registrationService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";

const registrationHandler = async (event) => {
  try {
    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId;

    if (!meetupId || !userId) {
      return sendError(400, "meetupId and userId are required");
    }

    await addRegistration(meetupId, userId);

    return sendSuccessResponse(201, { message: "User registered to meetup" });
  } catch (error) {
    const errorMap = {
      "Database error - Failed to add registration": 500,
      "Cannot register for past meetups": 400,
      "This meetup is already fully booked": 400,
      "User is already registered for this meetup": 400,
      "Meetup not found": 404,
    };

    const statusCode = errorMap[error.message] || 500;
    const message = error.message || "Internal server error";

    return sendError(statusCode, message);
  }
};

export const handler = middy(registrationHandler).use(validateToken);
