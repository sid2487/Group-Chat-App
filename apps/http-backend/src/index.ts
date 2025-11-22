import express from 'express';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";
import roomRoutes from "./routes/room.route";
import messageRoutes from "./routes/message.route";
import cors from "cors";


const app = express();

app.use(
  cors({
    // origin: "http://localhost:5173", // your frontend origin
    credentials: true, // must allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.json("hi there");
});

// routes
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/message", messageRoutes);

app.listen(5000);