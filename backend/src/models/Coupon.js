import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index.js";

export class Coupon extends Model {}

Coupon.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    kind: { type: DataTypes.ENUM("fixed","percent"), allowNull: false, defaultValue: "fixed" },
    amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    maxDiscount: { type: DataTypes.FLOAT, allowNull: true }
  },
  { sequelize, modelName: "Coupon" }
);
