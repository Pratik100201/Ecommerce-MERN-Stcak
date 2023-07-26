import productModel from "../model/productModel.js";
import slugify from "slugify";
import fs from "fs";
import categoryModel from "../model/categoryModel.js";
import braintree from "braintree";
import orderModel from "../model/orderModel.js";
import dotenv from "dotenv";

dotenv.config();
/*Payment Gateway */

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is requires" });
      case !description:
        return res.status(400).send({ error: "Description is requires" });
      case !price:
        return res.status(400).send({ error: "Price is requires" });
      case !category:
        return res.status(400).send({ error: "Category is requires" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is requires" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "Photo is requires & Photo < 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product has been created",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Product Controller",
    });
  }
};

//Controller to get all products

const getProduct = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Products are Here",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting all Products Controller",
    });
  }
};

//Controller to get single product

const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Here is your Product",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Single Controller",
    });
  }
};

//Controller to get photo of the product
const productPicController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Product Photo Controller",
    });
  }
};

//Deleting Single Product

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Product Controller",
    });
  }
};

//For Updating Product

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is requires" });
      case !description:
        return res.status(400).send({ error: "Description is requires" });
      case !price:
        return res.status(400).send({ error: "Price is requires" });
      case !category:
        return res.status(400).send({ error: "Category is requires" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is requires" });
      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "Photo is requires & Photo < 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product has been updated",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Updating Product Controller",
    });
  }
};

// Controller to Filter Products
const filterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Filtered products are here",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Filter Controller",
    });
  }
};

//Controller For Product Count
const productCount = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Succesfully Counted ",
      total,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Product Count Controller",
    });
  }
};

// Product List Controller for Single Page

const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Product List Controller",
    });
  }
};

//Controller TO Search Products

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Search Product Controller",
    });
  }
};
//regex will be search filter
//$options will set search case insensative

//similar product
const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//Category wise Product
const categoryProductController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Here are the products based on category",
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error while geting category related product",
      error,
    });
  }
};

//Payment Gateway Starts Here

const paymentTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Token Not Verified",
    });
  }
};
const paymentCheckController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i;
    });
    const newTransction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send({
            success: false,
          });
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Payment Not Verified",
    });
  }
};

export {
  createProduct,
  getProduct,
  getSingleProduct,
  productPicController,
  deleteProduct,
  updateProduct,
  filterController,
  productCount,
  productListController,
  searchProductController,
  realtedProductController,
  categoryProductController,
  paymentTokenController,
  paymentCheckController,
};
