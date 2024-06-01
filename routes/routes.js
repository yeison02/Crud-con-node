const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
const fs = require("fs");

// cargar imagen
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Se define donde se guardan los archivos cargados
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

// Procesar la carga de un solo archivo
var upload = multer({
  storage: storage,
}).single("image");

// Insertar un producto en la base de datos
router.post("/add", upload, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      cantDayAnt: req.body.cantAnt,
      cantDayEnt: req.body.cantEnt,
      cantDayFinal: req.body.cantFinal,
      img: req.file.filename,
    });
    await product.save();

    req.session.message = {
      type: "success",
      message: "Producto agregado exitosamente!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Definición de la ruta GET para la URL raíz "/"
router.get("/", async (req, res) => {
  try {
    // Buscar todos los productos en la base de datos usando el modelo Product
    const products = await Product.find().exec();

    // Renderizar la vista 'home' con los productos obtenidos
    res.render("home", {
      title: "Home page",
      products: products,
    });
  } catch (err) {
    // Si ocurre un error, responder con un mensaje de error en formato JSON
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("add_products", { title: "Añadir Productos" });
});

//Ruta para editar un producto
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (product == null) {
      res.render("/");
    } else {
      res.render("edit_product", {
        title: "Edit product",
        product: product,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("/");
  }
});

router.post("/update/:id", upload, async (req, res) => {
  try {
    const id = req.params.id;
    var new_img = "";

    if (req.file) {
      new_img = req.file.filename;
      try {
        await fs.unlinkSync("./uploads" + req.body.old_img);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_img = req.body.old_img;
    }

    await Product.findByIdAndUpdate(id, {
      name: req.body.name,
      cantDayAnt: req.body.cantAnt,
      cantDayEnt: req.body.cantEnt,
      cantDayFinal: req.body.cantFinal,
      img: new_img,
    });

    req.session.message = {
      type: "success",
      message: "Producto actualizado exitosamente!",
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: "danger" });
  }
});

// Ruta para eliminar un producto
router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Product.findByIdAndDelete(id);

    if (result.img != "") {
      try {
        await fs.unlinkSync("./uploads" + result.img);
      } catch (err) {
        console.log(err);
      }
    }

    req.session.message = {
      type: "info",
      message: "Producto eliminado exitosamente!",
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.json({ message: err.message });
  }
});

module.exports = router;
