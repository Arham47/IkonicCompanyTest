import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io"
import http from "http"
import socket from "./Socket/SocketRoutes/Routes.js"
import ChatRoutes from "./Routes/ChatRoutes.js"
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


const uploadFolder = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadFolder));
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin:["http://localhost:3000","http://localhost:3001"]
    }
});

io.on("connection", socket);
app.use("/chat", ChatRoutes);

const PORT = process.env.PORT || 5000; 
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {})
  .then(() =>

  httpServer.listen(PORT, () =>
      console.log(`server is running on localhost:${PORT}`)
    )
  )
  .catch((err) => console.log(err));

