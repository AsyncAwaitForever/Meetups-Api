import * as dynamoDbUtils from "../utils/dynamoDbUtils";
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils";
import { displayMeetup } from "./meetupService";

const usersTable = process.env.USERS_TABLE;
const regTable = process.env.REGISTRATIONS_TABLE;

export const getUserByEmail = async (email) => {
  try {
    const params = {
      TableName: usersTable,
      IndexName: "emailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const data = await dynamoDbUtils.queryItems(params);
    return data.Items[0] || null;
  } catch (error) {
    throw new Error("error fetching user");
  }
};

export const getUserById = async (userId) => {
  try {
    const params = {
      TableName: usersTable,
      Key: {
        userId,
      },
    };
    const user = await dynamoDbUtils.getItem(params);
    return user.Item || null;
  } catch (error) {
    throw new Error("Database error - Error fetching user by userId");
  }
};

export const signupUser = async (email, password, username) => {
  const userId = uuidV4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingEmail = await getUserByEmail(email);

  if (existingEmail) {
    throw new Error(`User with e-mail - ${email} is already registered`);
  }

  const user = {
    userId,
    email,
    password: hashedPassword,
    username,
  };
  const params = {
    TableName: usersTable,
    Item: user,
  };
  try {
    await dynamoDbUtils.putItem(params);
    return user;
  } catch (error) {
    throw new Error("Database error - failed to create user");
  }
};

export const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  // verifies password and generates token
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user.userId);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const getUserHistory = async (userId) => {
  try {
    const params = {
      TableName: regTable,
      IndexName: "userRegistrations",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const registrations = await dynamoDbUtils.queryItems(params);

    const meetupPromises = registrations.Items.map(async (registration) => {
      const meetup = await displayMeetup(registration.meetupId);
      return {
        meetupId: meetup.meetupId,
        title: meetup.title,
        status: meetup.status,
        //   we must check this, maybe better to have it on self meetup !and pick it up to response from meetup here if needed
      };
    });

    const meetups = await Promise.all(meetupPromises);

    return meetups;
  } catch (error) {
    throw new Error("Database error - failed to fetch user");
  }
};
