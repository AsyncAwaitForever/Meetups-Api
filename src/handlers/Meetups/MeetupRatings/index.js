import { displayMeetupRatings } from "../../../services/reviewService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import middy from "@middy/core";


const displayRatingsHandler = async (event) => {
    try {
      const { meetupId } = event.pathParameters || {};
  
      if (!meetupId) {
        return sendError(400, "meetupId is required");
      }
  
      console.log("Attempting to get ratings for meetupId:", meetupId); 
      const result = await displayMeetupRatings(meetupId);
      return sendSuccessResponse(200, result);
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        stack: error.stack,
        event: event
      });
      if (error.message.includes("Database error")) {
        return sendError(500, error.message);
      } 
      return sendError(500, "Internal server error");
    }
  };
  export const handler = middy(displayRatingsHandler);