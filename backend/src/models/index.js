import sequelize from "../../config/database.js";

export { sequelize };

export async function connectAndSync() {
  await sequelize.authenticate();
  await sequelize.sync();
}
