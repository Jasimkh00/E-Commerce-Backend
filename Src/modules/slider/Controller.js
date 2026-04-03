// Require Slider Service :
const sliderService = require("../../../Src/modules/slider/SliderService");

// CREATE SLIDER
const createSlider = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const slider = await sliderService.createSliderService(req.body);

    res.status(201).json({
      message: "Slider created",
      data: slider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SLIDERS
const getSliders = async (req, res) => {
  try {

    const sliders = await sliderService.getSlidersService();

    res.status(200).json({
      message: "Home sliders",
      data: sliders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SLIDER
const updateSlider = async (req, res) => {
  try {

    const slider = await sliderService.updateSliderService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Slider updated",
      data: slider
    });

  } catch (error) {
    if (error.message === "Slider not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// DELETE SLIDER
const deleteSlider = async (req, res) => {
  try {

    await sliderService.deleteSliderService(req.params.id);

    res.status(200).json({
      message: "Slider deleted"
    });

  } catch (error) {
    if (error.message === "Slider not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// Export Modules :
module.exports = {
  createSlider,
  getSliders,
  updateSlider,
  deleteSlider
};