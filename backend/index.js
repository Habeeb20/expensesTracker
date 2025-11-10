import express from "express"

import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./db.js";
import jwt from "jsonwebtoken"
import userRoutes from "./routes/userRoute.js"
import transactionRoutes from "./routes/transactionRoute.js"
import categoriesRoute from  "./routes/categoryRoute.js"
import budgetRoute from "./routes/budgetRoute.js"
import todorouter from "./routes/todoRoute.js";
connectDB()


///**********   ROUTES   ******** */



dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});





// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["http://localhost:5173" ] ,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));






// Routes
app.get("/", (req, res) => {
  res.send("expense tracker backend is listening on port....");
});

app.use("/api/user", userRoutes)
app.use("/api", transactionRoutes)
app.use("/api/budgets",budgetRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/todos", todorouter)


// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ status: false, message: "Internal server error" });
});





// Start server
const port = process.env.PORT || 1080;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})
































