import cartsRepository from "../persistences/mongo/repositories/carts.repository.mjs";
import customErrors from "../errors/customErrors.mjs"; // Import custom error handling

const getAll = async () => {
  const carts = await cartsRepository.getAll();
  if (!carts || carts.length === 0)
    throw customErrors.notFoundError("No carts found.");
  return carts;
};

const getById = async (id) => {
  const cart = await cartsRepository.getById(id);
  if (!cart) throw customErrors.notFoundError(`Cart with id: ${id} not found.`);
  return cart;
};

const create = async () => {
  const cart = await cartsRepository.create();
  if (!cart) throw customErrors.createError("Error creating cart.");
  return cart;
};

const addProduct = async (cid, pid) => {
  const updatedCart = await cartsRepository.addProduct(cid, pid);
  if (!updatedCart)
    throw customErrors.notFoundError(
      `Cart with id: ${cid} or product with id: ${pid} not found.`,
    );
  return updatedCart;
};

const updateProductQuantity = async (cid, pid, quantity) => {
  const updatedCart = await cartsRepository.updateProductQuantity(
    cid,
    pid,
    quantity,
  );
  if (!updatedCart)
    throw customErrors.notFoundError(
      `Cart with id: ${cid} or product with id: ${pid} not found.`,
    );
  return updatedCart;
};

const deleteProduct = async (cid, pid) => {
  const updatedCart = await cartsRepository.deleteProduct(cid, pid);
  if (!updatedCart)
    throw customErrors.notFoundError(
      `Cart with id: ${cid} or product with id: ${pid} not found.`,
    );
  return updatedCart;
};

const clear = async (cid) => {
  const result = await cartsRepository.clear(cid);
  if (!result)
    throw customErrors.notFoundError(`Cart with id: ${cid} not found.`);
  return result;
};

const handleCartStock = async (cid, removeOutOfStock = false) => {
  const cart = await cartsRepository.getById(cid);
  if (!cart)
    throw customErrors.notFoundError(`Cart with id: ${cid} not found.`);

  const productsNotinStock = [];

  // Check product stock and identify out-of-stock products
  for (const i of cart.products) {
    const stock = i.product.stock;
    if (stock < i.quantity) {
      productsNotinStock.push(i.product);
    }
  }

  let updatedCart = null;
  if (removeOutOfStock && productsNotinStock.length > 0) {
    // Remove out-of-stock products from the cart
    const productIdsToRemove = productsNotinStock.map((product) =>
      product._id.toString(),
    );
    updatedCart = await cartsRepository.deleteProducts(cid, productIdsToRemove);
    if (!updatedCart)
      throw customErrors.createError(
        "Error removing out-of-stock products from the cart.",
      );
  }

  return {
    productsNotinStock,
    updatedCart: updatedCart || cart,
  };
};

const getCartTotal = async (cid) => {
  const cart = await cartsRepository.getById(cid);
  if (!cart)
    throw customErrors.notFoundError(`Cart with id: ${cid} not found.`);

  let total = 0;
  // Calculate the total price of items in the cart
  for (const i of cart.products) {
    total += i.product.price * i.quantity;
  }
  return total;
};

export default {
  getAll,
  getById,
  create,
  addProduct,
  updateProductQuantity,
  deleteProduct,
  clear,
  getCartTotal,
  handleCartStock,
};
