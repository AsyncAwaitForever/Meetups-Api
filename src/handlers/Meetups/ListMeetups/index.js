import { listMeetups } from "../../../services/meetupService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";


export const handler = async () => {
  try {
    const meetups = await listMeetups();

    if (!meetups || meetups.length === 0) {
      return sendError(404, "meetups failed to load" );
    }

    return sendSuccessResponse(200, { meetups });
  } catch (error) {
    console.error("Error in listMeetups handler:", error);
    return sendError(500, "Internal server error");
  }
};
