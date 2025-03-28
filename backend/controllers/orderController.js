import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "http://localhost:5174"; // Ensure this is correct

app.use(express.json()); // Ensure JSON body parsing
app.use(cors({
    origin: frontend_url, // Restrict CORS to your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// 🛒 Placing an order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // ✅ Ensure total is at least ₹42
        if (amount < 42) {
            return res.json({
                success: false,
                message: "Minimum order amount should be ₹42."
            });
        }

        // ✅ Create and save the order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            status: "Pending",
            date: new Date(),
            payment: false
        });
        await newOrder.save();

        // ✅ Clear user cart after placing order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // ✅ Format items for Stripe checkout
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100 // Fix: Removed extra *80
            },
            quantity: item.quantity
        }));

        // ✅ Ensure delivery charges are included
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 200 // ₹2 * 100
            },
            quantity: 1
        });

        // ✅ Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

// 🔄 Verify Order Payment
const verifyOrder = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Payment Verified" });
        } else {
            return res.json({ success: false, message: "Payment Not Completed" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

// 🛍 Fetch user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// 📋 List all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "Error listing orders" });
    }
};

// 🔄 Update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };



// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js"
// import Stripe from "stripe"


// const stripe = new Stripe (process.env.STRIPE_SECRET_KEY)


// // placing order from frontend

// const placeOrder = async (req,res) =>{

//     const frontend_url = "http://localhost:5174";
// try{

//     // const newOrder = new orderModel({
//     //     userId:req.body.userId,
//     //     items:req.body.items,
//     //     amount:req.body.amount,
//     //     address:req.body.address
//     // })
//     const newOrder = new orderModel({
//         userId: req.body.userId,
//         items: req.body.items,
//         amount: req.body.amount,
//         address: req.body.address,
//         status: "Pending",  // ✅ Default status
//         date: new Date()     // ✅ Current date
//     })
    
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//     const line_items = req.body.items.map((item)=>({


//         Price_data:{
//             currency:"inr",
//             product_data:{
//                 name:item.name
//             },
//             unit_amount:item.price*100
//         },
//         quantity:item.quantity
//     }))

//     line_items.push({
//         Price_data:{
//             currency:"inr",
//             product_data:{
//                 name:"Delivery Charges"
//             },
//             unit_amount:2*100*80
//         },
//         quantity:1
//     })


//     const session = await stripe.checkout.sessions.create({
//         line_items:line_items,
//         mode:'payment',
//         success_url : `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     })
//     res.json({success:true,session_url:session.url})
// }catch(error) {
// console.log(error);
// res.json({success:false,message:"Error"})
// }

// }
// const verifyOrder = async(req,res)=>{
// const {orderId,success} = req.body;
// try{
//     if(success=="true"){
//         await orderModel.findByIdAndUpdate(orderId,{payment:true});
//         res.json({success:false,message:"Not Paid"})
//     }
// }catch(error){
//     console.log(error);
//     res.json({success:false,message:"Error"})
    

// }

// }
// // user orders for frontend
// const userOrders = async (req,res)=>{
//     try {
//         const orders = await orderModel.find({userId: req.body.userId});
//         res.json({success: true, data: orders})
//         } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//         } I
// }
// // listing orders for admin panel
//     const listOrders = async (req,res) =>{
//         try{
//             const orders = await orderModel.find({});
//             res.json({success:true,data:orders})
//         }catch(error){
//                 console.log(error);
//                 res.json({success:false,message:"Error"})
                
//         }
//     }


//     //api for updating order status
//     const updateStatus = async (req, res) =>{
//         try{
//             await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
//             res.json({success:true, message:"Status Updated"})
//         }catch(error){
//             console.log(error);
//             res.json({success:false, message:"Error"})
//         }
//     }
// export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};

