import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "../config/database.js";
import { User } from "./models/User.js";
import { Vehicle } from "./models/Vehicle.js";
import { Coupon } from "./models/Coupon.js";
import { Order } from "./models/Order.js";
import { OrderItem } from "./models/OrderItem.js";
import "./models/associations.js";
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicles.js";
import couponRoutes from "./routes/coupons.js";
import orderRoutes from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => {
  res.json({
    success: true,
    name: "DropEntregas API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    const vehicles = [
      { name: "Moto", basePrice: 20, defaultCoupon: "MOTO10" },
      { name: "Carro", basePrice: 50, defaultCoupon: "CARRO15" },
      { name: "Van", basePrice: 100, defaultCoupon: "VAN20" },
      { name: "Caminhão", basePrice: 200, defaultCoupon: "CAMINHAO25" },
      { name: "Ônibus", basePrice: 300, defaultCoupon: "ONIBUS30" }
    ];

    for (const vehicle of vehicles) {
      await Vehicle.findOrCreate({
        where: { name: vehicle.name },
        defaults: vehicle
      });
    }
    console.log("✅ Vehicles seeded");

    const coupons = [
      { code: "MOTO10", kind: "fixed", amount: 10 },
      { code: "CARRO15", kind: "percent", amount: 15 },
      { code: "VAN20", kind: "fixed", amount: 20 },
      { code: "CAMINHAO25", kind: "fixed", amount: 25 },
      { code: "ONIBUS30", kind: "fixed", amount: 30 }
    ];

    for (const coupon of coupons) {
      await Coupon.findOrCreate({
        where: { code: coupon.code },
        defaults: coupon
      });
    }
    console.log("✅ Coupons seeded");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database
    await sequelize.sync({ force: false });
    console.log("✅ Database synchronized successfully.");

    // Seed database
    await seed();

    app.listen(PORT, () => {
      console.log(`🚀 DropEntregas API running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();