// Require Sale Model :
const Sale = require("../../../Src/modules/sale/Model");

// Logic Create Sale :
const createSaleService = async (body) => {

  const sale = await Sale.create(body);

  return sale;
};

// Logic For Update Sale :
const updateSaleService = async (id, body) => {

  const sale = await Sale.findById(id);

  if (!sale) {
    throw new Error("Sale not found");
  }

  Object.assign(sale, body);

  await sale.save();

  return sale;
};

// Logic For Get Sale :
const getActiveSalesService = async () => {

  const now = new Date();

  const sales = await Sale.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true
  }).populate("products");

  return sales;
};

// Logic For Delete Sale :
const deleteSaleService = async (id) => {

  const sale = await Sale.findByIdAndDelete(id);

  if (!sale) {
    throw new Error("Sale not found");
  }

  return true;
};

// Export Modules:
module.exports = {
  createSaleService,
  updateSaleService,
  getActiveSalesService,
  deleteSaleService
};