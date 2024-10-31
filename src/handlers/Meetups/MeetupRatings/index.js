import { displayMeetupRatings } from "../../../services/reviewService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";


export const handler = async (event) => {
    try {
        const meetupId = JSON.parse(event.body)
      const ratings = await displayMeetupRatings();

      return sendSuccessResponse(200, ratings);
    } catch (error) {
      console.error("Error in display ratings handler:", error);
      if (error.message.includes("Database error")) {
        return sendError(500, "Database error, failed to display ratings");
      }
      if (error.message.includes("Rating not found")){
        return sendError(404, "No ratings found"); 
      }
      return sendError(500, "Internal server error");
    }
  };