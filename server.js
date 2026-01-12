import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 7000;
app.use("/api/v1", routes);

connectDB();
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
