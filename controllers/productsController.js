const Product = require('../models/ProductsModel');

const productsController = {};

productsController.getAllProducts = async (req, res) => {
    /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Get all products'
    #swagger.description = 'Retrieves a list of all products.'
    */
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        method: req.method,
        path: req.originalUrl,
        message: 'No products found',
      });
    }

    res.status(200).json({
      method: req.method,
      path: req.originalUrl,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      method: req.method,
      path: req.originalUrl,
      error: 'Server error',
      message: error.message,
    });
  }
};

productsController.getProductById = async (req, res) => {
      /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Get product by ID'
    #swagger.description = 'Retrieves a product by its ID.'
    */
  const { id: productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        method: req.method,
        path: req.originalUrl,
        param: productId,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      error: 'Server error',
      message: error.message,
    });
  }
};

productsController.createNewProduct = async (req, res) => {
      /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Create a new product'
    #swagger.description = 'Creates a new product.'
    */
  const {
    name,
    price,
    description,
    inStock,
    category,
    tag,
    brand,
    accountType,
    createdBy,
  } = req.body;

  try {
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(409).json({
        method: req.method,
        path: req.originalUrl,
        body: req.body,
        message: 'Product with this name already exists',
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      inStock,
      category,
      tag,
      brand,
      accountType,
      createdBy,
    });

    const result = await newProduct.save();

    if (!result) {
      return res.status(400).json({
        method: req.method,
        path: req.originalUrl,
        body: req.body,
        message: 'Product was not created successfully',
      });
    }

    res.status(201).json({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      error: 'Server error',
      message: error.message,
    });
  }
};

productsController.updateProductById = async (req, res) => {
      /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Update product by ID'
    #swagger.description = 'Updates a product by its ID.'
    */
  const { id: productId } = req.params;
  const {
    name,
    price,
    description,
    inStock,
    category,
    tag,
    brand,
    accountType,
    createdBy,
  } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        method: req.method,
        path: req.originalUrl,
        param: productId,
        message: 'Product not found',
      });
    }

    if (product.createdBy !== req.user?.email) {
      return res.status(403).json({
        method: req.method,
        path: req.originalUrl,
        param: productId,
        message: 'Forbidden: not your product',
      });
    }

    const updates = {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(description !== undefined && { description }),
      ...(inStock !== undefined && { inStock }),
      ...(category !== undefined && { category }),
      ...(tag !== undefined && { tag }),
      ...(brand !== undefined && { brand }),
      ...(accountType !== undefined && { accountType }),
      updatedAt: Date.now(),
    };

    if (name) {
      const existingProduct = await Product.findOne({
        name,
        _id: { $ne: productId },
      });

      if (existingProduct) {
        return res.status(409).json({
          method: req.method,
          path: req.originalUrl,
          param: productId,
          body: req.body,
          error: 'Duplicate name',
          message: 'A product with this name already exists',
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      body: req.body,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      body: req.body,
      error: 'Server error',
      message: error.message,
    });
  }
};

productsController.deleteProductById = async (req, res) => {
      /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Delete product by ID'
    #swagger.description = 'Deletes a product by its ID.'
    */
  const { id: productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        method: req.method,
        path: req.originalUrl,
        param: productId,
        message: 'Product not found',
      });
    }

    if (product.createdBy !== req.user?.email) {
      return res.status(403).json({
        method: req.method,
        path: req.originalUrl,
        param: productId,
        message: 'Forbidden: not your product',
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      method: req.method,
      path: req.originalUrl,
      param: productId,
      error: 'Server error',
      message: error.message,
    });
  }
};

module.exports = productsController;
