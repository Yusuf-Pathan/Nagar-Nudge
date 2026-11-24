const { DataTypes } = require('sequelize');
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } = require('../constants/complaint.constants');

module.exports = (sequelize) => {
  const Complaint = sequelize.define(
    'Complaint',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: { isIn: [COMPLAINT_CATEGORIES] },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Pending',
        validate: { isIn: [COMPLAINT_STATUSES] },
      },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: true },
      media: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      resolvedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'complaints' }
  );

  Complaint.associate = (models) => {
    Complaint.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
  };

  return Complaint;
};
