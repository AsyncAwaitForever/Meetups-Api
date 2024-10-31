import { displayRatings } from "../../../services/reviewService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";


export const handler = async () => {
    try {
      const ratings = await displayRatings();
  
      if (ratings.length === 0) {
        return sendError(404, "No ratings found"); 
      }
  
      return sendSuccessResponse(200, ratings);
    } catch (error) {
      console.error("Error in display ratings handler:", error);
      if (error.message.includes("Database error")) {
        return sendError(500, "Database error, failed to display ratings");
      }
      return sendError(500, "Internal server error");
    }
  };