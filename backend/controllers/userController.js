import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Added expiration
};

// Login user (Function body is empty in your code, implement logic here)
const loginUser = async (req, res) => {
    // Login logic will be added here
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json ({success:false,message:"User doesn't exsist "})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token = createToken (user._id);
        res.json({success:true,token})
    }
    catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating new user
        const newUser = new userModel({
            name: name,
            email: email,  // Fixed typo "I email"
            password: hashedPassword,
        });

        // Saving user to database
        const user = await newUser.save();

        // Generating JWT token
        const token = createToken(user._id);

        // Returning success response
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "An error occurred" });
    }
};

export  { loginUser, registerUser };
