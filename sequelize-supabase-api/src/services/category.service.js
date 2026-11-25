const { fn, col } = require('sequelize');
const { Category, Complaint } = require('../models');
const AppError = require('../utils/AppError');

const serialize = (category) => ({
  id: category.id,
  name: category.name,
  code: category.code,
  active: category.active,
  complaintCount: category.getDataValue('complaintCount') !== undefined
    ? Number(category.getDataValue('complaintCount'))
    : undefined,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const slugifyCode = (name) =>
  name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

exports.list = async (query = {}) => {
  const where = {};
  if (query.active === 'true') where.active = true;
  if (query.active === 'false') where.active = false;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 50));

  const { rows } = await Category.findAndCountAll({
    where,
    order: [['name', 'ASC']],
    limit,
    offset: (page - 1) * limit,
    attributes: {
      include: [
        [fn('COUNT', col('complaints.id')), 'complaintCount'],
      ],
    },
    include: [{ model: Complaint, as: 'complaints', attributes: [], required: false }],
    group: ['Category.id'],
    subQuery: false,
    distinct: true,
  });

  const total = await Category.count({ where });

  return {
    items: rows.map(serialize),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

exports.create = async (body) => {
  const code = body.code || slugifyCode(body.name);
  if (!code) throw new AppError('Could not derive a category code from name', 422);

  const existing = await Category.findOne({ where: { code } });
  if (existing) throw new AppError(`Category code ${code} already exists`, 409);

  const category = await Category.create({
    name: body.name,
    code,
    active: body.active !== undefined ? body.active : true,
  });

  return serialize(category);
};

exports.update = async (id, body) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError('Category not found', 404);

  if (body.code && body.code !== category.code) {
    const clash = await Category.findOne({ where: { code: body.code } });
    if (clash) throw new AppError(`Category code ${body.code} already exists`, 409);

    // Keep existing complaints pointing at the category via code
    const oldCode = category.code;
    await Complaint.update({ category: body.code }, { where: { category: oldCode } });
  }

  if (body.name !== undefined) category.name = body.name;
  if (body.code !== undefined) category.code = body.code;
  if (body.active !== undefined) category.active = body.active;
  await category.save();

  return serialize(category);
};

exports.remove = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError('Category not found', 404);

  const used = await Complaint.count({ where: { category: category.code } });
  if (used > 0) {
    throw new AppError(`Category is used by ${used} complaint(s). Deactivate it instead.`, 409);
  }

  await category.destroy();
};

exports.serialize = serialize;
