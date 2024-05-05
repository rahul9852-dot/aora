import {Account, Client, ID, Avatars, Databases, Query, Storage} from "react-native-appwrite";

export const config = {
  endpoint:'https://cloud.appwrite.io/v1',
  platform:'com.aroa.native',
  projectId:'661e985fd17d4b3abeb8',
  databaseId:'661e9b274f09a57645b0',
  userCollectionId:'661e9b4436fb62a09ef8',
  videoCollectionId:'661e9b730a725a8f1727',
  storageId:'661e9e3dc6142aa98a8a',
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId
} = config;

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


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
    return newUser;
  }catch(error){
    console.log(error);
    throw new Error(error);
  }
}


export const  signIn = async(email, password)=> {
  try{
    const session = await account.createEmailSession(email, password);
    return session;

  }catch(error){
    throw new Error(error);
  }
}

export const getCurrentUser = async () =>{

  try{
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw Error;

    return currentUser.documents[0];

  }catch(error){
    console.log(error);
  }
}

export const getAllPosts  = async () =>{
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]

    )
    return posts.documents;
    
  }catch(error){
    throw new Error(error);
  }
}


export const getLatestPosts  = async () =>{
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )
    return posts.documents;
    
  }catch(error){
    throw new Error(error);
  }
}

export const searchPosts  = async (query) =>{
  try{
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    )
    return posts.documents;
    
  }catch(error){
    throw new Error(error);
  }
}


// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const signOut = async()=>{
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  if (!file) return;

  const asset = {
    name:file.fileName ,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }


  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}