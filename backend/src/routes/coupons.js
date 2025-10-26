import { Router } from "express";
import { Coupon } from "../models/Coupon.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [["id", "ASC"]],
      attributes: ['id', 'code', 'kind', 'amount', 'maxDiscount', 'createdAt']
    });

    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    console.error('Coupons error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar cupons' 
    });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ 
      where: { code: code.toUpperCase() },
      attributes: ['id', 'code', 'kind', 'amount', 'maxDiscount', 'createdAt']
    });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: "Cupom não encontrado" 
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Coupon by code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar cupom' 
    });
  }
});

export default router;
