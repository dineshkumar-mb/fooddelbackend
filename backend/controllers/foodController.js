import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add Food Item
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  let image_filename = req.file.filename;
  const food = new foodModel({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error saving food" });
  }
};

// List All Foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// Remove Food Item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      fs.unlink(`uploads/${food.image}`, () => {
        foodModel.findByIdAndDelete(req.body.id).then(() =>
          res.json({ success: true, message: "Food removed" })
        );
      });
    } else {
      res.json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };



// import foodModel from "../models/foodModel.js"; 

// import fs from "fs";

// //add food item

// const addFood = async (req,res) =>{
//  let image_filename = `${req.file.filename}`;
//  const food = new foodModel({
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//     category: req.body.category,
//     image: image_filename
//  })
//  try{
//     await food.save();
//     res.json({success: true, message: "Food added"})
//  } catch(error){
//     console.log(error);
//     res.json({success: false, message: "Error"})
//  }
// }


// //all food list

// const listFood = async (req, res) => {
//     try{
//         const foods = await foodModel.find({});
//         res.json({success: true, data: foods})
//     } catch(error){
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }

// // remove food item
// const removeFood = async (req, res) => {
//     try{
//         const food = await foodModel.findById(req.body.id);
//         fs.unlink(`uploads/${food.image}`, () => {
//             foodModel.findByIdAndDelete(req.body.id).then(food => res.json({success: true, message: "Food removed"}))
//         })
//     } catch(error){
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }
// export {addFood,listFood,removeFood}