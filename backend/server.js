const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter=require("./routes/main.router");
const userRouter=require("./routes/user.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

dotenv.config();


yargs(hideBin(process.argv))
  .command("init", "Initialise a new repository", {}, initRepo)
  .command("start", "starts a new server", {}, startServer)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Make the changes permanent",
    (yargs) => {
      yargs.positional("message", {
        describe: "Make changes permanent",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("pull", "pull commit to S3", {}, pullRepo)
  .command("push", "push commit to S3", {}, pushRepo)
  .command(
    "revert <commitID>",
    "you might go to previous commit!",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "you might go to previous commit!",
        type: "string",
      });
    },
    revertRepo
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURL = process.env.MONGODB_URL;

  mongoose
    .connect(mongoURL)
    .then(() => console.log("Mongodb connected"))
    .catch((err) => console.error("unable to connect:", err));

  app.use(cors({ origin: "*" })); //request hamari kisi bhi location se ya kisi bhi URL se aa sakti hai and will be treated as valid path(security concern override ho jayegi, all request will be allowed.)

  app.use("/",mainRouter);
  
  let user="test";
  // Build a server based on app
  const httpServer=http.createServer(app);
  // In the server we will enable a socket
  const io=new Server(httpServer,{
    cors:{
      origin:"*",
      methods:["GET","POST"],//User will allowed to send GET and POST request
    }
  });
  
  // jab server trigger hota hai,toh we want to established a connection and we want to add the user to this connection.
  io.on("connection",(socket)=>{
    socket.on("joinRoom",(userID)=>{
      user=userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    })
  })
  
  const db=mongoose.connection;
  
  // ek baar jab humm database connection ko open karega toh sarri request jo humm likhh rahe wo ekk ka baad ekk run ho jayegi.
  db.once("open",async()=>{
    console.log("CRUD operations called");
    // CRUD operations
  });
  
  app.use("/",userRouter);
  // create server
  httpServer.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`);
  })
}