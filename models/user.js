module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    userName: { type: DataTypes.STRING, allowNull: false },
    homeTown: DataTypes.STRING,

    favoriteActivity: DataTypes.STRING,
    favoriteDestination: DataTypes.STRING,
    milesTraveled: { type: DataTypes.INTEGER, defaultValue: 0 },
    profilePicture: DataTypes.STRING
  });
  User.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    User.hasMany(models.Destination, {
      onDelete: "cascade"
    });
    User.hasMany(models.Activity, {
      onDelete: "cascade"
    });
  };
  return User;
};
