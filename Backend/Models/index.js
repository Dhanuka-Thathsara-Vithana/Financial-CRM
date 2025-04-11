const config = require("../config/dbConfig.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.js")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.js")(sequelize, Sequelize);
db.ticket = require("./ticket.js")(sequelize, Sequelize);


db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id"
});

db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id"
});

db.ticket.belongsTo(db.user, {
  as: "creator",
  foreignKey: "createdBy"
});

db.ticket.belongsTo(db.user, {
  as: "assignee",
  foreignKey: "assignedTo"
});

db.user.hasMany(db.ticket, {
  as: "createdTickets",
  foreignKey: "createdBy"
});

db.user.hasMany(db.ticket, {
  as: "assignedTickets",
  foreignKey: "assignedTo"
});

module.exports = db;