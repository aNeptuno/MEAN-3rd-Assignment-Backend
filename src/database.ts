import * as mongodb from 'mongodb';
import { User } from './user';

export const collections: {
    users?: mongodb.Collection<User>;
} = {}

export async function connectToDB(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("users");
    await applySchemaValidation(db);

    const usersConnection = db.collection<User>('users');
    collections.users = usersConnection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description:"'name' is required and is a string"
                },
                email : {
                    bsonType: "string",
                    description:"'email' is required and is a string",
                    minLength: 5
                },
                enum : {
                    bsonType: "string",
                    description:"'genre' is required and is a one of 'woman', 'men' or 'other'",
                    enum: ["woman","men","other"]
                }
            }
        }
    };

    await db.command({
        collMod: 'users',
        validator: jsonSchema
    })
    .catch(async (error: mongodb.MongoServerError)=>{
        if(error.codeName === 'NamespaceNotFound'){
            await db.createCollection('users', {validator:jsonSchema})
        }
    })
}