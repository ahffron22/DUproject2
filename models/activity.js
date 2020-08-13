module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    activityName: { type: DataTypes.STRING, allowNull: false },
    activityDescription: DataTypes.STRING,
    activityType: DataTypes.STRING
  });
  Activity.associate = function(models) {
    Activity.belongsTo(models.Destination, {});
  };
  return Activity;
};
