const { User, Task } = require('../models');
const AppError = require('../utils/AppError');

exports.list = async ({ page, limit }) => {
  const { rows, count } = await User.findAndCountAll({ limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
  return { items: rows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};

exports.getById = async (id) => {
  const user = await User.findByPk(id, { include: [{ model: Task, as: 'tasks' }] });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.create = (data) => User.create(data);

exports.update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', 404);
  return user.update(data);
};

exports.remove = async (id) => {
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) throw new AppError('User not found', 404);
};
