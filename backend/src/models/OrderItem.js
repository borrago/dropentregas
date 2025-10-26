import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    OrderId: { type: DataTypes.INTEGER, allowNull: false },
    VehicleId: { type: DataTypes.INTEGER, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false },
    lineTotal: { type: DataTypes.FLOAT, allowNull: false }
  },
  { sequelize, modelName: "OrderItem" }
);
