import { addRating } from "../../../services/reviewService";
import middy from "@middy/core";
import { sendSuccessResponse, sendError } from "../../../utils/apiResponses";
import validateToken from "../../../middleware/auth";

const ratingHandler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const text = body.text;
    const meetupId = event.pathParameters.meetupId;
    const userId = event.userId;
    const stars = parseInt(body.stars, 10);

    if (!meetupId) {
      return sendError(400, "meetupId are required");
    }
    if (!userId) {
      return sendError(401, "Authentication required");
    }

    await addRating(userId, meetupId, stars, text);

    return sendSuccessResponse(201, {
      message: "User successfully added a review",
    });
  } catch (error) {
    console.error("Error in add rating handler:", error);
    const errorMap = {
      "Stars must be a whole number between 1 and 5": 400,
      "Text cannot be empty": 400,
      "Meetup not found": 404,
      "User is not registered for this meetup": 400,
      "User has already reviewed this meetup": 400,
      "Database error - failed to add rating": 500,
    };

    const statusCode = errorMap[error.message] || 500;
    const message = error.message || "Internal server error";

    return sendError(statusCode, message);
  }
};

export const handler = middy(ratingHandler).use(validateToken);
