const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const products = require("../data/products");

const router = express.Router();

// route=>1: POST  /api/products
// desc: create a new product in the DB
// access: private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //Reference to the admin admin user who create it
    });

    const createProduct = await product.save();
    res.status(201).json(createProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>2: PUT  /api/products/:id
// desc: update an the existing product by ID
// access: private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    //find product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      // save the updated product to DB
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// route=>3: DELETE  /api/products/:id
// desc: delete an the existing product by ID
// access: private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // find the product by ID
    const product = await Product.findById(req.params.id);
    if (product) {
      // Remove the product from DB
      await product.deleteOne();
      res.json({ message: "Product Removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>4: GEt  /api/products
// desc: Get all the products with optional query filters
// access: public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};
    // filter logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { material: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
      ];
    }

    //sorting logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }
    // fetch products and apply sorting and limit
    let product = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>7: GET  /api/products/best-seller
// desc: Retrieve the product with highest rating
// access: public

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>8: GET  /api/products/new-arrivals
// desc: Retrieve latest 8 products based on creation date
// access: public

router.get("/new-arrivals", async (req, res) => {
  try {
    //fetch latest 8 products from DB
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>5: GET  /api/products/:id
// desc: Get a single product by its ID
// access: public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route=>6: GET  /api/products/similar/:id
// desc: Retrieve similar products based on the current product's gender and category
// access: public

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, //exclude the current product ID
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
