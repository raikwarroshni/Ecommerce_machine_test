import cors from "cors";
import express from "express";
import router from "./route/index.js";
import { mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import runInitialDBScript from "./utils/initialScript.js";

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log("Database Error", error);
  });

app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
);
runInitialDBScript();
app.use(cors());
app.use("/v1", router);

app.use((req, res) =>
  res.status(200).json({ message: "API servier is working fine" })
);

const port = process.env.PORT || 8080;
app
  .listen(port)
  .on("listening", () => {
    console.log(`🚀Process started on port ${port}!🚀 `);
  })
  .on("error", (error) => {
    console.log(`An error occured while starting server`);
    console.log(error);
  });
