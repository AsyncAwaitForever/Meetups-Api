import { addRegistration } from "../../../services/registrationService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";


const registrationHandler = async (event) => {
  try {

    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId

    if (!meetupId || !userId) {
        return sendError(400, "meetupId and userId are required");

    }

    await addRegistration(meetupId, userId);

    return sendSuccessResponse(201, { message: "User registered to meetup" });
  } catch (error) {
    console.error("Error in registration handler:", error);
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to register for the meetup");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(registrationHandler).use(validateToken)