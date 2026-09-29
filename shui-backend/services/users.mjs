import { v4 as uuid } from 'uuid';
import { db } from './db.mjs';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';
import { hashPassword } from '../utils/token.mjs';

// Finds one user by username (returns undefined if not found)
export const getUserByUsername = async (username) => {
    const { Item } = await db.send(new GetCommand({
        TableName : process.env.TABLE_NAME,
        Key : { PK : `USER#${username}`, SK : 'PROFILE' }
    }));

    return Item;
};

// Creates a new user with a hashed password
export const createUser = async (username, email, password) => {
    const user = {
        id : uuid(),
        username : username,
        email : email,
        password : await hashPassword(password)  
    };

    try {
        await db.send(new PutCommand({
            TableName : process.env.TABLE_NAME,
            Item : { 
                PK : `USER#${user.username}`, 
                SK : 'PROFILE', 
                ...user 
            },
            ConditionExpression : 'attribute_not_exists(PK)'   // stops duplicate usernames
        }));
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(409, { 
                message : 'Username already exists' 
            });
        }
        throw error;
    }

    return user;
};
