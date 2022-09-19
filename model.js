const { Model, DataTypes } = require("sequelize");
const sequelize = require("./connection-sequelize");

class TestPagination extends Model {}

TestPagination.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "test_pagination",
    modelName: "TestPagination",
    sequelize,
  }
);
TestPagination.sync();
module.exports = TestPagination;
