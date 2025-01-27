import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to a database.");
    return;
  }

  try {
    const db = await mongoose.connect(
      "mongodb+srv://evronz:teenfoyle%40Evr0nz12@link-test.bxuis.mongodb.net/link-test-db"
    );

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected successfully");
  } catch (err) {
    console.log("Database connectin failed", err);

    process.exit(1);
  }
}

export default dbConnect;
