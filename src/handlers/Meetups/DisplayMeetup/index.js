import { displayMeetup } from "../../../services/meetupService";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";


export const handler = async (event) => {
  try {

    const meetupId = event.pathParameters.meetupId

    const meetup = await displayMeetup(meetupId);

    if (!meetup) {
      return sendError(404, "meetup not found" );
    }

    return sendSuccessResponse(200, { meetup });
  } catch (error) {
    console.error("Error in display meetup handler:", error);
    return sendError(500, "Internal server error");
  }
};