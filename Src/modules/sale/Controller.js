// Require Sale Service :
const saleService = require("../../../Src/modules/sale/SaleServices");

// CREATE SALE
const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSaleService(req.body);

    res.status(201).json({
      message: "Sale created",
      data: sale
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SALE
const updateSale = async (req, res) => {
  try {
    const sale = await saleService.updateSaleService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Sale updated",
      data: sale
    });

  } catch (error) {
    if (error.message === "Sale not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE SALES
const getActiveSales = async (req, res) => {
  try {
    const sales = await saleService.getActiveSalesService();

    res.status(200).json({
      message: "Active sales",
      data: sales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SALE
const deleteSale = async (req, res) => {
  try {
    await saleService.deleteSaleService(req.params.id);

    res.status(200).json({
      message: "Sale deleted successfully"
    });

  } catch (error) {
    if (error.message === "Sale not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// Export Modules :
module.exports = {
  createSale,
  updateSale,
  getActiveSales,
  deleteSale
};