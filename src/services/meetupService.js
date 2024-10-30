import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { v4 as uuidV4 } from "uuid";
import meetupsData from "../data/meetups.json";

const meetupsTable = process.env.MEETUPS_TABLE;

export const loadMeetups = async () => {
  try {
    const existingMeetups = await dynamoDbUtils.scanItems({
      TableName: meetupsTable,
      Limit: 1,
    });

    if (existingMeetups.Items && existingMeetups.Items.length > 0) {
      console.log("Meetups already exist");
      return { success: false, message: "Meetups already exist" };
    }

    for (const meetup of meetupsData) {
      const params = {
        TableName: meetupsTable,
        Item: {
          meetupId: uuidV4(),
          title: meetup.title,
          category: meetup.category,
          location: meetup.location,
          time: meetup.time,
          host: meetup.host,
          description: meetup.description,
          availableCapacity: meetup.availableCapacity,
          maxCapacity: meetup.maxCapacity,
        },
      };
      await dynamoDbUtils.putItem(params);
    }
    console.log("Meetups loaded successfully.");
  } catch (error) {
    throw new Error("Database error - failed to load meetups");
  }
};

export const listMeetups = async () => {
  try {
    const params = {
      TableName: meetupsTable,
    };
    const result = await dynamoDbUtils.scanItems(params);
    return result.Items;
  } catch (error) {
    throw new Error("Database error - Failed to list meetups");
  }
};

export const displayMeetup = async (meetupId) => {
  try {
    const params = {
      TableName: meetupsTable,
      Key: {
        meetupId: meetupId,
      },
    };
    const result = await dynamoDbUtils.getItem(params);
    return result.Item;
  } catch (error) {
    throw new Error("Database error - failed to display this meetup");
  }
};

export const searchMeetups = async (keyword) => {
  try {
    const params = {
      TableName: meetupsTable,
      FilterExpression:
        "contains(#title, :keyword) OR contains(#description, :keyword)",
      ExpressionAttributeNames: {
        "#title": "title",
        "#description": "description",
      },
      ExpressionAttributeValues: {
        ":keyword": keyword.toLowerCase(),
      },
    };

    const result = await dynamoDbUtils.scanItems(params);
    return result.Items || [];
  } catch (error) {
    throw new Error("Database error - failed to search meetups");
  }
};
