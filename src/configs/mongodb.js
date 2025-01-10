import mongoose from 'mongoose';

// https://www.mongodb.com/docs/atlas/troubleshoot-connection/#special-characters-in-connection-string-password
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@cluster0.xk0u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

main().catch((err) => console.log('Error Connecting with db: ', err));

async function main() {
  await mongoose.connect(uri);

  console.log('Db connected successfully!');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
