const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCateg = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productService.getProductsByCateg(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
async function createProduct(req, res, next) {
  const {
    name,
    category,
    description,
    price,
    picture,
    rating,
    stock,
    numOfRatings,
    orderId,
  } = req.body;
  console.log('req.body=====>', req.body);
  try {
    console.log('Request body:', req.body);
    const product = await productService.createProduct({
      name: name,
      category: category,
      description: description,
      price: Number(price),
      picture: picture,
      rating: Number(rating),
      stock: Number(stock),
      numOfRatings: Number(numOfRatings),
      orderId: orderId,
    });
    console.log('Product created:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in controller:', error.message);
    next(error);
  }
}

const deleteProductById = async (req, res) => {
  try {
    const result = await productService.deleteProductById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCateg,
  createProduct,
  deleteProductById,
};
