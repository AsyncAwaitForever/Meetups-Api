import { loadMeetups } from "../../../services/meetupService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";

export const handler = async () => {
  try {
    const result = await loadMeetups();

    if (!result.success) {
      return sendError(400, { message: "meetups already loaded" });
    }

    return sendSuccessResponse(200, { message: "meetups loaded successfully" });
  } catch (error) {
    console.error("Error in loadMeetups handler:", error);
    return sendError(500, {message: "Internal server error"});
  }
};
