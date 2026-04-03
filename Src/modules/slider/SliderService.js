// Require Slider Model :
const Slider = require("../../../Src/modules/slider/Model");

// Logic For Create Slider :
const createSliderService = async (body) => {

  const slider = await Slider.create(body);

  return slider;
};

// Logic For Get Slider :
const getSlidersService = async () => {

  const sliders = await Slider.find({
    isActive: true
  }).sort({ order: 1 });

  return sliders;
};

// Logic For Update Slider :
const updateSliderService = async (id, body) => {

  const slider = await Slider.findById(id);

  if (!slider) {
    throw new Error("Slider not found");
  }

  Object.assign(slider, body);

  await slider.save();

  return slider;
};


// Logic For Delete Slider :
const deleteSliderService = async (id) => {

  const slider = await Slider.findById(id);

  if (!slider) {
    throw new Error("Slider not found");
  }

  await slider.deleteOne();

  return true;
};

// Export Modules :
module.exports = {
  createSliderService,
  getSlidersService,
  updateSliderService,
  deleteSliderService
};