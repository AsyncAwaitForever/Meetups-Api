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

export const queryMeetupsByDate = async (date) => {
  try {
    const params = {
      TableName: meetupsTable,
      IndexName: dateIndex,
      KeyConditionExpression: "#date = :date",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":date": date,
      },
    };
    const data = await dynamoDbUtils.queryItems(params);
    return data.Items;
  } catch (error) {
    throw new Error("Database error - failed to filter/query meetups by date");
  }
};

export const queryMeetupsByLocation = async (location) => {
  try {
    const params = {
      TableName: meetupsTable,
      IndexName: locationIndex,
      KeyConditionExpression: "#location = :location",
      ExpressionAttributeNames: {
        "#location": "location",
      },
      ExpressionAttributeValues: {
        ":location": location,
      },
    };
    const data = await dynamoDbUtils.queryItems(params);
    return data.Items;
  } catch (error) {
    throw new Error(
      "Database error - failed to filter/query meetups by location"
    );
  }
};

export const queryMeetupsByCategory = async (category) => {
  try {
    const params = {
      TableName: meetupsTable,
      IndexName: categoryIndex,
      KeyConditionExpression: "#category = :category",
      ExpressionAttributeNames: {
        "#category": "category",
      },
      ExpressionAttributeValues: {
        ":category": category,
      },
    };
    const data = await dynamoDbUtils.queryItems(params);
    return data.Items;
  } catch (error) {
    throw new Error(
      "Database error - failed to filter/query meetups by category"
    );
  }
};

export const queryMeetupsWithOptions = async (options) => {
  try {
    const { date, category, location } = options;
    let results = [];

    if (date && category && location) {
      results = await queryMeetupsByDate(date);
      results = results.filter(
        (meetup) => meetup.category === category && meetup.location === location
      );
      return results;
    }

    if (date && category) {
      results = await queryMeetupsByDate(date);
      results = results.filter((meetup) => meetup.category === category);
    } else if (date && location) {
      results = await queryMeetupsByDate(date);
      results = results.filter((meetup) => meetup.location === location);
    } else if (category && location) {
      results = await queryMeetupsByCategory(category);
      results = results.filter((meetup) => meetup.location === location);
    } else if (date) {
      results = await this.queryMeetupsByDate(date);
    } else if (category) {
      results = await this.queryMeetupsByCategory(category);
    } else if (location) {
      results = await this.queryMeetupsByLocation(location);
    }

    return results;
  } catch (error) {
    throw new Error("Database error - failed to query meetups");
  }
};
