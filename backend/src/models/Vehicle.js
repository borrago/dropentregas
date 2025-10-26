import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Vehicle extends Model {}

Vehicle.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    basePrice: { type: DataTypes.FLOAT, allowNull: false },
    defaultCoupon: { type: DataTypes.STRING, allowNull: true }
  },
  { sequelize, modelName: "Vehicle" }
);
