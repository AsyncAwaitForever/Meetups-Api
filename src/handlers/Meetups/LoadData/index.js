import { loadMeetups } from "../../../services/meetupService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";

export const handler = async () => {
  try {
    const result = await loadMeetups();

    if (!result.success) {
      return sendError(400, "meetups already loaded");
    }

    return sendSuccessResponse(200, { message: "meetups loaded successfully" });
  } catch (error) {
    console.error("Error in loadMeetups handler:", error);
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to load meetups");
    }
    return sendError(500, "Internal server error");
  }
};
