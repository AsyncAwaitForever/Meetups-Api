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
    const registration = registrationResponse.Item;

    if (registration) {
      throw new Error("User is already registered for this meetup");
    }

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

    await dynamoDbUtils.updateItem(updateParams);

    const params = {
      TableName: registrationsTable,
      Item: {
        meetupId: meetupId,
        userId: userId,
        status: "upcoming", //  store status like 'upcoming', 'past'
        //   we must check this, maybe better to have it on self meetup !and pick it up to response from meetup here if needed
      },
    };
    await dynamoDbUtils.putItem(params);
  } catch (error) {
    throw new Error("Database error - Failed to add registration");
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
    const registration = registrationResponse.Item;

    if (!registration) {
      throw new Error("User is not registered for this meetup");
    }

    const deleteParams = {
      TableName: registrationsTable,
      Key: {
        meetupId: meetupId,
        userId: userId,
      },
      ReturnValues: "ALL_OLD",
    };

    const deletedData = await dynamoDbUtils.deleteItem(deleteParams);

    const updatedCapacity = meetup.availableCapacity + 1;

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

    await dynamoDbUtils.updateItem(updateParams);

    return deletedData.Attributes;
  } catch (error) {
    throw new Error("Database error - Failed to remove registration");
  }
};
