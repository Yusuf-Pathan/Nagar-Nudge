const { Task, User } = require('../models');
const AppError = require('../utils/AppError');

exports.list = async ({ page, limit, status, userId }) => {
  const where = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;
  const { rows, count } = await Task.findAndCountAll({
    where,
    limit,
    offset: (page - 1) * limit,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
  return { items: rows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
};

exports.getById = async (id) => {
  const task = await Task.findByPk(id, { include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] });
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

exports.create = (data) => Task.create(data);

exports.update = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) throw new AppError('Task not found', 404);
  return task.update(data);
};

exports.remove = async (id) => {
  const deleted = await Task.destroy({ where: { id } });
  if (!deleted) throw new AppError('Task not found', 404);
};
