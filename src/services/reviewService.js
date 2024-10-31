import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { v4 as uuidV4 } from "uuid";
//const registrationsTable = process.env.REGISTRATIONS_TABLE;
const meetupsTable = process.env.MEETUPS_TABLE;
const ratingsTable = process.env.RATINGS_TABLE;

export const addRating = async ( userId, meetupId, stars, text) =>{

    try {
        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
            throw new Error("Stars must be a whole number between 1 and 5");
        }
        if (typeof text !== 'string' || text.trim() === '') {
            throw new Error("Text cannot be empty");
        }

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

        const ratingParams = {
            TableName: ratingsTable,
            IndexName: 'userMeetupIndex', 
            KeyConditionExpression: "userId = :userId and meetupId = :meetupId",
            ExpressionAttributeValues: {
              ":userId": userId,
              ":meetupId": meetupId,
            },
          };
        const ratingResponse = await dynamoDbUtils.queryItems(ratingParams)

        if (ratingResponse.Items.length > 0) {
            throw new Error("User has already reviewed this meetup");
        }
        const ratingId = uuidV4()

        const params = {
            TableName: ratingsTable,
            Item: {
              ratingId: ratingId,
              userId: userId,
              meetupId: meetupId,
              stars: stars,
              text: text,
            },
          };
      
          await dynamoDbUtils.putItem(params);

          return { success: true, message: "review added successfully" };
    } catch (error) {
        throw new Error("Database error - Failed to add registration");
    }
}

export const displayRatings = async () => {
    try {
      const ratingParams = {
        TableName: ratingsTable,
      };
      const ratingResponse = await dynamoDbUtils.scanItems(ratingParams);
  
      if (!ratingResponse.Items || ratingResponse.Items.length === 0) {
        return []; 
      }
  
      return ratingResponse.Items;
    } catch (error) {
      throw new Error("Database error - Failed to display ratings");
    }
  };

  export const getMeetupById = async (meetupId) => {
    try {
      const params = {
        TableName: meetupsTable,
        Key: {
          meetupId: meetupId
        }
      };
  
      const result = await dynamoDbUtils.getItem(params);
      return result.Item;
    } catch (error) {
      throw new Error("Database error - failed to get meetup");
    }
  };

  export const displayMeetupRatings = async (meetupId) => {
    try {
  
        const params = {
          TableName: ratingsTable,
          IndexName: "meetupIndex",
          KeyConditionExpression: "#meetupId = :meetupId",
          ExpressionAttributeNames: {
            "#meetupId": "meetupId"
          },
          ExpressionAttributeValues: {
            ":meetupId": meetupId
          }
        };
         console.log("Query params:", JSON.stringify(params, null, 2));
        const result = await dynamoDbUtils.queryItems(params);
      console.log("Query result:", JSON.stringify(result, null, 2));
        const items = result.Items || [];
        
        if (items.length === 0) {
          return []; 
        }
        
        return result.Items;
      } catch (error) {
        console.error("Error in displayMeetupRatings:", error);
        console.error("Error stack:", error.stack);
        throw new Error("Database error - Failed to display ratings");
      }
    }; 
