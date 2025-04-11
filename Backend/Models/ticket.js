module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("tickets", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      serialNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      clientAddress: {
        type: Sequelize.TEXT
      },
      clientPhone: {
        type: Sequelize.STRING
      },
      clientEmail: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'completed', 'closed'),
        defaultValue: 'open'
      },
      notes: {
        type: Sequelize.TEXT
      }
    });
  
    return Ticket;
  };