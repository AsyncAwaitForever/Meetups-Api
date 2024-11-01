import * as dynamoDbUtils from "../utils/dynamoDbUtils";

const registrationsTable = process.env.REGISTRATIONS_TABLE;
const meetupsTable = process.env.MEETUPS_TABLE;

export const addRegistration = async (meetupId, userId) => {
  try {
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
    const currentTime = new Date().toISOString();
    if (meetup.time < currentTime) {
      throw new Error("Cannot register for past meetups");
    }
    if (meetup.availableCapacity <= 0) {
      throw new Error("This meetup is already fully booked");
    }

    const registrationParams = {
      TableName: registrationsTable,
      Key: {
        meetupId: meetupId,
        userId: userId,
      },
    };
    const registrationResponse = await dynamoDbUtils.getItem(
      registrationParams
    );

    if (registrationResponse.Item) {
      throw new Error("User is already registered for this meetup");
    }

    try {
      const updatedCapacity = meetup.availableCapacity - 1;

      const updateParams = {
        TableName: meetupsTable,
        Key: {
          meetupId: meetupId,
        },
        UpdateExpression: "SET availableCapacity = :capacity",
        ExpressionAttributeValues: {
          ":capacity": updatedCapacity,
        },
      };

      const addRegistrationParams = {
        TableName: registrationsTable,
        Item: {
          meetupId: meetupId,
          userId: userId,
        },
      };
      await dynamoDbUtils.updateItem(updateParams);
      await dynamoDbUtils.putItem(addRegistrationParams);
      return {
        success: true,
        message: "Registration successful",
      };
    } catch (dbError) {
      throw new Error("Database error - failed to complete registration");
    }
  } catch (error) {
    if (
      error.message.includes("Meetup not found") ||
      error.message.includes("Cannot register for past meetups") ||
      error.message.includes("already fully booked") ||
      error.message.includes("already registered")
    ) {
      throw error;
    }
    throw new Error("Database error - failed to add registration");
  }
};

export const removeRegistration = async (meetupId, userId) => {
  try {
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

    if (meetup.time < new Date().toISOString()) {
      throw new Error("Cannot unregister from past meetups");
    }

    const registrationParams = {
      TableName: registrationsTable,
      Key: {
        meetupId: meetupId,
        userId: userId,
      },
    };
    const registrationResponse = await dynamoDbUtils.getItem(
      registrationParams
    );

    if (!registrationResponse.Item) {
      throw new Error("User is not registered for this meetup");
    }

    try {
      const deleteParams = {
        TableName: registrationsTable,
        Key: {
          meetupId: meetupId,
          userId: userId,
        },
        ReturnValues: "ALL_OLD",
      };

      const updateParams = {
        TableName: meetupsTable,
        Key: {
          meetupId: meetupId,
        },
        UpdateExpression: "SET availableCapacity = :capacity",
        ExpressionAttributeValues: {
          ":capacity": meetup.availableCapacity + 1,
        },
      };
      const deletedData = await dynamoDbUtils.deleteItem(deleteParams);
      await dynamoDbUtils.updateItem(updateParams);

      return deletedData.Attributes;
    } catch (dbError) {
      throw new Error("Database error - failed to complete unregistration");
    }
  } catch (error) {
    if (
      error.message.includes("Meetup not found") ||
      error.message.includes("Cannot unregister from past meetups") ||
      error.message.includes("User is not registered")
    ) {
      throw error;
    }
    throw new Error("Database error - failed to remove registration");
  }
};
