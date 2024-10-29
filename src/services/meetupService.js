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
          location: meetup.location,
          time: meetup.time,
          host: meetup.host,
        },
      };
      await dynamoDbUtils.putItem(params);
    }
    console.log("Meetups loaded successfully.");
    return { success: true, message: "Meetups loaded successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to load meetups.",
      error: error.message,
    };
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
    throw new Error("Failed to list meetups");
  }
};
