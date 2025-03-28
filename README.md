🍔 Food Delivery App (MERN Stack)
📌 Overview
This is a Food Delivery App built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to browse restaurants, add food items to their cart, place orders, and track deliveries.

🚀 Features
🔹 User Features
✅ Sign up & login (JWT authentication)
✅ Browse  & menus
✅ Add food items to the cart
✅ Place orders & make payments
✅ Track order status


🔹 Admin Features
✅  menu management
✅ Order management
✅ User management


🔹 Delivery Partner Features
✅ View assigned orders
✅ Update order status (Picked up, Delivered)

🛠️ Tech Stack
Frontend:
React.js

context (for state management)

Tailwind CSS / Bootstrap

Backend:
Node.js & Express.js

MongoDB & Mongoose

JSON Web Tokens (JWT) for authentication

Other Tools:
Cloudinary (for image uploads)

Stripe (for payments)

Socket.io (for real-time order tracking)

🏗️ Installation & Setup
1️⃣ Clone the repository
sh

git clone https://github.com/your-repo/food-delivery-app.git
cd food-delivery-app
2️⃣ Install dependencies
Backend
sh

cd backend
npm install
Frontend
sh

cd frontend
npm install
3️⃣ Set up environment variables
Create a .env file in the backend directory and add the following:

env

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
4️⃣ Run the application
Backend
sh

cd backend
npm start
Frontend
sh

cd frontend
npm start
5️⃣ Open in Browser
Go to: http://localhost:5173

📌 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	User login
GET	/api/restaurants	Get all restaurants
GET	/api/foods/:id	Get food items of a restaurant
POST	/api/orders	Place an order
GET	/api/orders/:id	Get order details
📜 License
This project is open-source under the MIT License.

🤝 Contributing
Pull requests are welcome! Feel free to improve the project and submit a PR.

💡 Happy Coding! 🚀🍕






