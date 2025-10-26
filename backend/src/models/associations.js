import { User } from "./User.js";
import { Vehicle } from "./Vehicle.js";
import { Order } from "./Order.js";
import { OrderItem } from "./OrderItem.js";
import { Coupon } from "./Coupon.js";

// User associations
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'OrderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// Vehicle associations
Vehicle.hasMany(OrderItem, { foreignKey: 'VehicleId' });
OrderItem.belongsTo(Vehicle, { foreignKey: 'VehicleId', as: 'vehicle' });

export { User, Vehicle, Order, OrderItem, Coupon };


