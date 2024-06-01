//imports
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const indexRoutes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 4000;

//conexion a la base de datos
mongoose
  .connect(process.env.DB_URL)

  .then(() => {
    console.log("Conectado a mongodb");
  })
  .catch((error) => {
    console.log("Error al conectar mongodb", error);
  });

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//Establecer motor de plantilla
app.set("view engine", "ejs");

//usar archivos estaticos
app.use(express.static("uploads"));

//usar las rutas
app.use(indexRoutes);

app.listen(PORT, () => {
  console.log(`Servidor inicializado en https://localhost:${PORT}`);
});
