import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import dynamoDb from "../services/dynamoDb";

export const putItem = async (params) => {
  const command = new PutCommand(params);
  return dynamoDb.send(command);
};

export const getItem = async (params) => {
  const command = new GetCommand(params);
  return dynamoDb.send(command);
};

export const updateItem = async (params) => {
  const command = new UpdateCommand(params);
  return dynamoDb.send(command);
};

export const deleteItem = async (params) => {
  const command = new DeleteCommand(params);
  return dynamoDb.send(command);
};

/* export const queryItems = async (params) => {
  const command = new QueryCommand(params);
  return dynamoDb.send(command);
}; */
export const queryItems = async (params) => {
  try {
    const command = new QueryCommand(params);
    const response = await dynamoDb.send(command);
    return response;
  } catch (error) {
    console.error("DynamoDB Query Error:", {
      error: error.message,
      params: params,
    });
    throw error;
  }
};

export const scanItems = async (params) => {
  const command = new ScanCommand(params);
  return dynamoDb.send(command);
};
