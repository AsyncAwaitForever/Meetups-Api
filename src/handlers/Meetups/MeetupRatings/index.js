import { displayMeetupRatings } from "../../../services/reviewService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";


export const handler = async (event) => {
    try {
        const meetupId = event.pathParameters.meetupId
        const ratings = await displayMeetupRatings(meetupId);

        if (!meetupId) {
            return sendError(400, "meetupId is required");
          }

      return sendSuccessResponse(200, ratings);
    } catch (error) {
      console.error("Error in meetupratings handler", error);
      if (error.message.includes("Database error")) {
        return sendError(500, "Database error, failed to display ratings");
      }
      if (error.message.includes("No ratings found")){
        return sendError(404, "No ratings found"); 
      }
      return sendError(500, "Internal server error");
    }
  };