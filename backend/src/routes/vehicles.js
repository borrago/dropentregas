import { Router } from "express";
import { Vehicle } from "../models/Vehicle.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [["id", "ASC"]],
      attributes: ['id', 'name', 'basePrice', 'defaultCoupon', 'createdAt']
    });

    res.json({
      success: true,
      data: vehicles,
      count: vehicles.length
    });
  } catch (error) {
    console.error('Vehicles error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar veículos' 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID do veículo inválido' 
      });
    }

    const vehicle = await Vehicle.findByPk(id, {
      attributes: ['id', 'name', 'basePrice', 'defaultCoupon', 'createdAt']
    });

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        message: 'Veículo não encontrado' 
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Vehicle by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar veículo' 
    });
  }
});

export default router;