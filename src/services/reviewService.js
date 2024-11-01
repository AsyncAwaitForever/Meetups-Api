import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { v4 as uuidV4 } from "uuid";
import { getUserById } from "./userService";

const registrationsTable = process.env.REGISTRATIONS_TABLE;
const meetupsTable = process.env.MEETUPS_TABLE;
const ratingsTable = process.env.RATINGS_TABLE;

export const addRating = async (userId, meetupId, stars, text) => {
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error("Stars must be a whole number between 1 and 5");
  }
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("Text cannot be empty");
  }

  try {
    const user = await getUserById(userId);

    const meetupParams = {
      TableName: meetupsTable,
      Key: {
        meetupId: meetupId,
      },
    };
    const meetupResponse = await dynamoDbUtils.getItem(meetupParams);
    const meetup = meetupResponse.Item;

    if (!meetup) {
      throw new Error("Meetup not found");
    }

    const isRegisteredParams = {
      TableName: registrationsTable,
      Key: {
        meetupId: meetupId,
        userId: userId,
      },
    };

    const registrationResponse = await dynamoDbUtils.getItem(
      isRegisteredParams
    );
    const registration = registrationResponse.Item;
    if (!registration) {
      throw new Error("User is not registered for this meetup");
    }

    const ratingParams = {
      TableName: ratingsTable,
      IndexName: "userMeetupIndex",
      KeyConditionExpression: "userId = :userId and meetupId = :meetupId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":meetupId": meetupId,
      },
    };
    const ratingResponse = await dynamoDbUtils.queryItems(ratingParams);

    if (ratingResponse.Items.length > 0) {
      throw new Error("User has already reviewed this meetup");
    }
    const ratingId = uuidV4();

    const params = {
      TableName: ratingsTable,
      Item: {
        ratingId: ratingId,
        userId: userId,
        username: user.username,
        meetupId: meetupId,
        stars: stars,
        text: text,
      },
    };

    await dynamoDbUtils.putItem(params);

    return { success: true, message: "review added successfully" };
  } catch (error) {
    if (
      error.message.includes("Meetup not found") ||
      error.message.includes("User is not registered") ||
      error.message.includes("User has already reviewed")
    ) {
      throw error;
    }
    throw new Error("Database error - failed to add rating");
  }
};

export const displayMeetupRatings = async (meetupId) => {
  try {
    const params = {
      TableName: ratingsTable,
      IndexName: "meetupIndex",
      KeyConditionExpression: "#meetupId = :meetupId",
      ExpressionAttributeNames: {
        "#meetupId": "meetupId",
      },
      ExpressionAttributeValues: {
        ":meetupId": meetupId,
      },
    };
    const result = await dynamoDbUtils.queryItems(params);

    const items = result.Items || [];

    if (items.length === 0) {
      return [];
    }

    return items;
  } catch (error) {
    throw new Error("Database error - Failed to display ratings");
  }
};
