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

    // const currentTime = new Date().toISOString();   //  we can fix this later tu push status also

    for (const meetup of meetupsData) {
      const params = {
        TableName: meetupsTable,
        Item: {
          meetupId: uuidV4(),
          title: meetup.title.toLowerCase(),
          category: meetup.category,
          location: meetup.location,
          time: meetup.time,
          host: meetup.host,
          description: meetup.description.toLowerCase(),
          availableCapacity: meetup.availableCapacity,
          maxCapacity: meetup.maxCapacity,
          // status: meetup.time < currentTime ? "past" : "upcoming",   // status for meetups objects
        },
      };
      await dynamoDbUtils.putItem(params);
    }
    console.log("Meetups loaded successfully.");
    return { success: true, message: "Meetups loaded successfully" };
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

    // -->>>>>>  with this we could be able change/update status each time we list meetups ! <<<<<<<<-------

    /*     const currentTime = new Date().toISOString();

    const updatePromises = result.Items.map(async (meetup) => {
      const newStatus = meetup.time < currentTime ? "past" : "upcoming";

      if (meetup.status !== newStatus) {
        const updateParams = {
          TableName: meetupsTable,
          Key: {
            meetupId: meetup.meetupId,
          },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": newStatus,
          },
        };
        await dynamoDbUtils.updateItem(updateParams);
        meetup.status = newStatus;
      }

      return meetup;
    });
        const updatedMeetups = await Promise.all(updatePromises);
        return updatedMeetups; */

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
    /*     const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const params = {
      TableName: meetupsTable,
      IndexName: "dateIndex",
      KeyConditionExpression: "#time BETWEEN :startDate AND :endDate",
      ExpressionAttributeNames: {
        "#time": "time",
      },
      ExpressionAttributeValues: {
        ":startDate": startOfDay,
        ":endDate": endOfDay,
      },
    }; */

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const searchDate = `${formattedDate}T`;

    const params = {
      TableName: meetupsTable,
      IndexName: "timeIndex",
      KeyConditionExpression: "begins_with(#time, :searchDate)",
      ExpressionAttributeNames: {
        "#time": "time",
      },
      ExpressionAttributeValues: {
        ":searchDate": searchDate,
      },
    };

    console.log("Query attempt with params:", JSON.stringify(params, null, 2));

    const sampleData = await dynamoDbUtils.scanItems({
      TableName: meetupsTable,
      Limit: 1,
    });
    console.log("Sample data in DB:", JSON.stringify(sampleData, null, 2));

    const data = await dynamoDbUtils.queryItems(params);
    return data.Items;
  } catch (error) {
    console.error("Full error details:", error);
    throw new Error("Database error - failed to filter/query meetups by date");
  }
};

export const queryMeetupsByLocation = async (location) => {
  try {
    const params = {
      TableName: meetupsTable,
      IndexName: "locationIndex",
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
      IndexName: "categoryIndex",
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

    console.log("Options received:", options);
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
      results = await queryMeetupsByDate(date);
    } else if (category) {
      results = await queryMeetupsByCategory(category);
    } else if (location) {
      results = await queryMeetupsByLocation(location);
    } else {
      const params = {
        TableName: meetupsTable,
      };
      const data = await dynamoDbUtils.scanItems(params);
      results = data.Items;
    }

    return results;
  } catch (error) {
    console.error("Query error:", error);
    throw new Error("Database error - failed to query meetups");
  }
};
