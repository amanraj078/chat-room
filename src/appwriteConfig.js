import { Client, Databases, Account } from "appwrite";

export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client();
export const account = new Account(client);

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

export const database = new Databases(client);

export default client;
