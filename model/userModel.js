module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      },
      otp:{
        type: DataTypes.STRING
      },
      otpGeneratedTime:{
        type: DataTypes.STRING
      }
    });
    return User;
  };
  