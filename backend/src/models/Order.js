import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: true },
    destination: { type: DataTypes.STRING, allowNull: true },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    discount: { type: DataTypes.FLOAT, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false }
  },
  { sequelize, modelName: "Order" }
);
