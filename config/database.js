const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection succesful!"))
  .catch((err) => console.log("erro na conexão= ", err));
