const express = require('express');
const cors = require("cors");
const bodyparser = require('body-parser');
require('dotenv').config()

const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// import routes
const controllerRoutes = require("./routes/index");


// route middlewares
app.use("/api/v1", controllerRoutes);

// iniciar server
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
