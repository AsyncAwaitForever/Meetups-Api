import { displayMeetupRatings } from "../../../services/reviewService";
import { sendError, sendResponse } from "../../../utils/apiResponses";
import middy from "@middy/core";

const meetupsHandler = async (event) => {
  try {
    const { meetupId } = event.pathParameters || {};
    const ratings = await displayMeetupRatings(meetupId);

    if (!meetupId) {
      return sendError(400, "meetupId is required");
    }

    return sendResponse(200, { ratings: ratings });
  } catch (error) {
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to display ratings");
    }
    if (error.message.includes("No ratings found")) {
      return sendError(404, "No ratings found");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(meetupsHandler);
