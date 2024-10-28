import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import dynamoDb from "../services/dynamoDb"

export const putItem = async (tableName, item) => {
    const command = new PutCommand({
        TableName: tableName,
        Item: item,
    });
    return dynamoDb.send(command)
};

export const getItem = async (tableName, key) => {
    const command = new GetCommand({
        TableName: tableName,
        Key: key,
    });
    return dynamoDb.send(command);
};

export const updateItem = async (tableName, key, updateExpression, expressionAttributeValues) => {
    const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW',
    });
    return dynamoDb.send(command);
};

export const deleteItem = async (tableName, key) => {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
    });
    return dynamoDb.send(command);
};

export const queryItems = async (tableName, queryParams) => {
    const command = new QueryCommand({
        TableName: tableName,
        ...queryParams,
    });
    return dynamoDb.send(command);
};

export const scanItems = async (tableName, scanParams = {}) => {
    const command = new ScanCommand({
        TableName: tableName,
        ...scanParams,
    });
    return dynamoDb.send(command);
};