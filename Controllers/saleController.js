// Require Sale Model :
const Sale = require("../Models/saleModel");

// Logic For Create Sale (For Admin) :
const createSale = async (req,res)=>{

    // Using Try-Catch :
try{

    // Gte Data From Body :
 const sale = await Sale.create(req.body)

//  Response :
 res.status(201).json({
  message:"Sale created",
  data:sale
 });

}catch(error){
 res.status(500).json({message:error.message});
}
};


// Logic For Update Sale (For Admin) :
const updateSale = async (req,res)=>{

    // Using Try-Catch :
try{

    // Find Sale :
 const sale = await Sale.findById(req.params.id)

 if(!sale){
  return res.status(404).json({
   message:"Sale not found"
  });
 }

 Object.assign(sale,req.body)

//  Save Sale And Response :
 await sale.save()

 res.status(200).json({
  message:"Sale updated",
  data:sale
 });

}catch(error){
 res.status(500).json({message:error.message});
}
};


// Logic For Get Active Sale (For Public) :
const getActiveSales = async (req,res)=>{

    // Using Try-Catch :
try{

 const now = new Date()

//  Find Sale :
 const sales = await Sale.find({
  startDate:{$lte:now},
  endDate:{$gte:now},
  isActive:true
 }).populate("products")

//  Response :
 res.status(200).json({
  message:"Active sales",
  data:sales
 });

}catch(error){
 res.status(500).json({message:error.message})
}
};

// Logic For Delete Sale (For Admin) :
const deleteSale = async (req, res) => {
  try {

    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    res.status(200).json({
      message: "Sale deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT MODULE :
module.exports={
 createSale,
 updateSale,
 getActiveSales,
 deleteSale
};