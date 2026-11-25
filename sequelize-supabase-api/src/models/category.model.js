const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define(
    'Category',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false },
      code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { tableName: 'categories' }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Complaint, { foreignKey: 'category', sourceKey: 'code', as: 'complaints' });
  };

  return Category;
};
