const express = require("express");
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const dbConfig = require("./configs/db.config");

/**Intialize Express**/
const app = express();

app.use(express.json());

/**Database Connection**/
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on("error", () => {
  console.log("ERROR WHILE CONNECTING TO DB");
});

db.once("open", () => {
  console.log("Connected to Database");
});

require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/ticket.route")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Server Started on PORT ${serverConfig.PORT}`);
});
