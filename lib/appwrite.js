import {Account, Client, ID, Avatars, Databases} from "react-native-appwrite"

export const config = {
  endpoint:'https://cloud.appwrite.io/v1',
  platform:'com.aroa.native',
  projectId:'661e985fd17d4b3abeb8',
  databaseId:'661e9b274f09a57645b0',
  userCollectionId:'661e9b4436fb62a09ef8',
  videoCollectionId:'661e9b730a725a8f1727',
  storageId:'661e9e3dc6142aa98a8a'
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async(email, password, username) =>{
  try{

    const newAccount = await account.create(
      accountId= ID.unique(),
      email,
      password,
      username
    )

    if(!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )
    return newUser;
  }catch(error){
    console.log(error);
    throw new Error(error);
  }
}


export async function signIn(email, password){
  try{

    const session = await account.createEmailSession(email, password);
    return session;

  }catch(error){
    throw new Error(error);
  }
}