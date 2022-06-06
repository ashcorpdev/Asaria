import consolaGlobalInstance from "consola";
import userModel = require("./model/user");
import teamModel = require("./model/team");

const mongoose = require("mongoose");
async function main() {
  consolaGlobalInstance.info("Connecting to Mongo database...");
  await mongoose.connect(
    `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?authSource=admin`
  );
  consolaGlobalInstance.success("Connected to Mongo!");

  /**
   * This will initialise the collections if they don't already exist, 
   * but also ensures that the indexes are built correctly to ensure 
   * that any unique values are actually unique.
  */
  userModel.init().then(() => {
    consolaGlobalInstance.success("User database model built successfully.");
  });
  teamModel.init().then(() => {
      consolaGlobalInstance.success('Team database model built succesfully.');
  })
}

main();

export = {};
