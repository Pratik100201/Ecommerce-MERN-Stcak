import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import path from "path";

/* Initializing express */
const app = express();

/* dotenv file configuration for further use */
dotenv.config();

/* Database connect*/
connectDB();

/* middleware  */
app.use(cors());
app.use(express.json()); /*We can now send req/res in json({}) file also */
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
/*PORT Decclaration */
const PORT = process.env.PORT;

/* Routing */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Port is running on http//:localhost:${PORT}`.bgBlack.white);
});
