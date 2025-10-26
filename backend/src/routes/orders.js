import { Router } from "express";
import jwt from "jsonwebtoken";
import { Vehicle } from "../models/Vehicle.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { User } from "../models/User.js";
import "../models/associations.js";

const router = Router();

// Middleware de autenticação
const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token de acesso não fornecido' });
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado' });
    }
    return res.status(401).json({ success: false, message: 'Erro de autenticação' });
  }
};

function applyCouponToSubtotal(subtotal, coupon) {
  if (!coupon) return 0;
  let discount = 0;
  if (coupon.kind === "fixed") {
    discount = coupon.amount;
  } else if (coupon.kind === "percent") {
    discount = subtotal * (coupon.amount / 100.0);
  }
  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  return Math.max(0, discount);
}

router.post("/price", async (req, res) => {
  try {
    const { items, couponCode } = req.body || {};
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Items são obrigatórios" 
      });
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const { vehicleId, qty } = item;

      if (!vehicleId) {
        return res.status(400).json({ 
          success: false, 
          message: 'VehicleId é obrigatório para cada item' 
        });
      }

      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ 
          success: false, 
          message: `Veículo com ID ${vehicleId} não encontrado` 
        });
      }

      const quantity = Math.max(1, Number(qty || 1));
      const itemTotal = vehicle.basePrice * quantity;
      subtotal += itemTotal;

      processedItems.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        quantity,
        unitPrice: vehicle.basePrice,
        total: itemTotal
      });
    }

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        where: { code: String(couponCode).toUpperCase().trim() }
      });
    }

    const discount = applyCouponToSubtotal(subtotal, coupon);
    const total = Math.max(0, subtotal - discount);

    res.json({
      success: true,
      data: {
        items: processedItems,
        subtotal,
        discount,
        total,
        coupon: coupon ? {
          code: coupon.code,
          kind: coupon.kind,
          amount: coupon.amount
        } : null
      }
    });
  } catch (error) {
    console.error('Price calculation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao calcular preço' 
    });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { items, couponCode, origin, destination } = req.body || {};
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Items são obrigatórios" 
      });
    }

    if (!origin || !destination) {
      return res.status(400).json({ 
        success: false, 
        message: "Origem e destino são obrigatórios" 
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { vehicleId, qty } = item;

      if (!vehicleId) {
        return res.status(400).json({ 
          success: false, 
          message: 'VehicleId é obrigatório para cada item' 
        });
      }

      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ 
          success: false, 
          message: `Veículo com ID ${vehicleId} não encontrado` 
        });
      }

      const quantity = Math.max(1, Number(qty || 1));
      const unitPrice = vehicle.basePrice;
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      orderItems.push({
        VehicleId: vehicle.id,
        qty: quantity,
        unitPrice,
        lineTotal
      });
    }

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        where: { code: String(couponCode).toUpperCase().trim() }
      });
    }

    const discount = applyCouponToSubtotal(subtotal, coupon);
    const total = Math.max(0, subtotal - discount);

    const order = await Order.create({
      UserId: req.user.id,
      origin: origin.trim(),
      destination: destination.trim(),
      subtotal,
      discount,
      total
    });

    for (const orderItem of orderItems) {
      await OrderItem.create({
        ...orderItem,
        OrderId: order.id
      });
    }

    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: "items",
        include: [{
          model: Vehicle,
          as: "vehicle",
          attributes: ['id', 'name', 'basePrice']
        }]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [{
        model: OrderItem,
        as: "items",
        include: [{
          model: Vehicle,
          as: "vehicle",
          attributes: ['id', 'name', 'basePrice']
        }]
      }],
      order: [["id", "DESC"]]
    });

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('My orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar pedidos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;