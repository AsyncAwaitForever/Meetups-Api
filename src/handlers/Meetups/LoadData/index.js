import { loadMeetups } from "../../../services/meetupService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";

export const handler = async (event) => {
  try {
    const result = await loadMeetups();

    if (!result.success) {
        return sendError(400,{message: 'meetups already loaded'} );
    }

    return sendSuccessResponse(200, {message: 'meetups loaded succesfullt'})
  } catch (error) {
    console.error("Error in loadMeetups handler:", error);
    return apiResponse(500, {
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};