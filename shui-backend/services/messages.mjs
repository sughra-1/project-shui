import { v4 as uuid } from 'uuid';
import { db } from './db.mjs';
import{
    GetCommand,
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

export const getMessages = async (username) => {
    const params = username
    ? {
            TableName : 'shuiTable',
            IndexName : 'GSI2',
            KeyConditionExpression : 'GSI2PK = :pk AND begins_with(GSI2SK, :sk)',
            ExpressionAttributeValues : {
                ':pk' : `USER#${username}`, ':sk' : 'MESSAGE#'
            }
        }
        :{
                // Get all messages (GSI1)
            TableName : 'shuiTable',
            IndexName : 'GSI1',
            KeyConditionExpression : 'GSI1PK = :pk',
            ExpressionAttributeValues : { ':pk' : 'MESSAGES' }
        };

        const { Items } = await db.send(new QueryCommand({
    
    ScanIndexForward : false,   // newest messages first
    ...params
  }));

  return Items;

}

export const getMessageById = async (id) => {
    const { Item }  = await db.send (new GetCommand({
        TableName : 'shuiTable',
        Key : {
            PK : `MESSAGE#${id}`,
            SK : 'METADATA'
        }
            
        }));

        if (!Item) {
            throw createError(404, {
                message : "No message found"
            });

        }

        return Item;
    };

    export const createMessage = async(username, text) => {
        //creates id and created at

        const message = {
            id : uuid(),
            username : username,
            text : text,
            createdAt : new Date().toISOString()
        };

        await db.send(new PutCommand({
            TableName : 'shuiTable',
            Item : {
                PK : `MESSAGE#${message.id}`,         //get one message by id
                SK : 'METADATA',
                GSI1PK : 'MESSAGES',                  //get all messages
                GSI1SK : message.createdAt,
                GSI2PK : `USER#${message.username}`,   //get messages from one user
                GSI2SK : `MESSAGE#${message.createdAt}`,
                ...message
            }

        }));

        return message;
    };


    // Updates the text of a message and returns the updated message

export const updateMessage = async (id, text) => {
    const { Attributes } = await db.send(new UpdateCommand({
        TableName : 'shuiTable',
        Key : { 
            PK : `MESSAGE#${id}`, 
            SK : 'METADATA' 
        },
        UpdateExpression : 'SET #text = :text, updatedAt = :updatedAt',
        ExpressionAttributeNames : { '#text' : 'text' },   
        ExpressionAttributeValues : {
            ':text' : text,
            ':updatedAt' : new Date().toISOString()
        },
        ReturnValues : 'ALL_NEW'   // return the message after the update
    }));

    return Attributes;
};


// Deletes one message by its id
export const deleteMessage = async (id) => {
    await db.send(new DeleteCommand({
        TableName : 'shuiTable',
        Key : { 
            PK : `MESSAGE#${id}`, 
            SK : 'METADATA' 
        }
    }));
};

