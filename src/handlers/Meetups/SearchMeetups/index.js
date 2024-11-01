import middy from "@middy/core";
import { searchMeetups } from "../../../services/meetupService";
import { sendError, sendResponse } from "../../../utils/apiResponses";

const searchHandler = async (event) => {
  try {
    const { keyword } = event.queryStringParameters || {};

    if (!keyword || keyword.trim().length === 0) {
      return sendError(
        400,
        "keyword field is required and keyword must be at least 1 character"
      );
    }
    //  this is optional!

    /*     if (!meetups || meetups.length === 0) {
      return sendResponse(200, {
        success: false,
        message: "No meetups found",
      });
    } */

    const meetups = await searchMeetups(keyword);
    return sendResponse(200, { meetups });
  } catch (error) {
    if (error.message.includes("Database error")) {
      return sendError(500, "Database error, failed to search meetups");
    }
    return sendError(500, "Internal server error");
  }
};

export const handler = middy(searchHandler);
