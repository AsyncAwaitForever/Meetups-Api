import * as dynamoDbUtils from "../utils/dynamoDbUtils";

const registrationsTable = process.env.REGISTRATIONS_TABLE;

export const addRegistration = async (meetupId, userId) => {
    try {
      const params = {
        TableName: registrationsTable,
        Item: {
          meetupId: meetupId,
          userId: userId 
        },
      };
      await dynamoDbUtils.putItem(params);
    } catch (error) {
      throw new Error("Database error - Failed to add registration");
    }
};
