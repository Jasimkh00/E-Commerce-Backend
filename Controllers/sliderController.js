// Require Slider Model :
const Slider = require("../Models/sliderModel");

// Logic For Create Slider (For Admin) :
const createSlider = async (req, res) => {

    // Using Try-Catch :
    try {

        // Get Data From Body :
        const slider = await Slider.create(req.body);

        //   Response :
        res.status(201).json({
            message: "Slider created",
            data: slider
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


// Logic For Get Slider (HOME-PAGE For Public) :
const getSliders = async (req, res) => {

    // Using Try-Catch :
    try {

        // Find Slider :
        const sliders = await Slider.find({
            isActive: true
        }).sort({ order: 1 });

        //  Response :
        res.status(200).json({
            message: "Home sliders",
            data: sliders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


// Logic For Update Slider :
const updateSlider = async (req, res) => {

    // Using Try-Catch :
    try {

        // Find Slider By Id :
        const slider = await Slider.findById(req.params.id);

        // Using If :
        if (!slider) {
            return res.status(404).json({
                message: "Slider not found"
            });
        }

        // Update And Save :
        Object.assign(slider, req.body)

        await slider.save();

        // Response :
        res.status(200).json({
            message: "Slider updated",
            data: slider
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


// Logic For Delete Slider :
const deleteSlider = async (req, res) => {

    // Using Try-Catch :
    try {

        const slider = await Slider.findById(req.params.id)
        // Using If :
        if (!slider) {
            return res.status(404).json({
                message: "Slider not found"
            });
        }

        // Delete And Response :
        await slider.deleteOne()
        res.status(200).json({
            message: "Slider deleted"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


// Export Module :
module.exports = {
    createSlider,
    getSliders,
    updateSlider,
    deleteSlider
};