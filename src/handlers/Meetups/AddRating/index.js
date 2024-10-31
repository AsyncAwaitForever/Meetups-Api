import { addRating } from "../../../services/reviewService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";


const ratingHandler = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const text = body.text
    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId
    const stars = parseInt(body.stars, 10);


    if (!meetupId || !userId) {
        return sendError(400, "meetupId and userId are required");

    }

    await addRating(userId, meetupId, stars, text)

    return sendSuccessResponse(201, { message: "User succesfully added a review" });
  } catch (error) {
    console.error("Error in addrating handler:", error);
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to add rating");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(ratingHandler).use(validateToken)