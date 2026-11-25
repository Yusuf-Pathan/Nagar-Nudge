const { fn, col, literal, Op } = require('sequelize');
const { Complaint, Category, User } = require('../models');
const AppError = require('../utils/AppError');
const { toPublicUrl } = require('../utils/mediaStorage');

const serialize = (complaint) => ({
  id: complaint.id,
  title: complaint.title,
  description: complaint.description,
  category: complaint.category,
  categoryName: complaint.categoryRef ? complaint.categoryRef.name : complaint.category,
  status: complaint.status,
  address: complaint.address,
  location: {
    latitude: Number(complaint.latitude),
    longitude: Number(complaint.longitude),
  },
  media: (complaint.media || []).map((m) => ({ type: m.type, url: toPublicUrl(m.path) })),
  assignedTo: complaint.assignedTo || null,
  assignedAt: complaint.assignedAt || null,
  assignee: complaint.assignee
    ? { id: complaint.assignee.id, name: complaint.assignee.name }
    : null,
  user: complaint.user ? { id: complaint.user.id, name: complaint.user.name } : null,
  submittedAt: complaint.createdAt,
  resolvedAt: complaint.resolvedAt,
});

const ASSOCIATIONS = [
  { model: User, as: 'user', attributes: ['id', 'name'] },
  { model: User, as: 'assignee', attributes: ['id', 'name'] },
  { model: Category, as: 'categoryRef', attributes: ['id', 'name', 'code'] },
];

const buildWhere = (query = {}) => {
  const where = {};
  if (query.status) where.status = query.status;
  if (query.category) where.category = query.category;
  if (query.assigned === 'true') where.assignedTo = { [Op.ne]: null };
  if (query.assigned === 'false') where.assignedTo = null;
  if (query.search) {
    const q = `%${query.search}%`;
    where[Op.or] = [
      { title: { [Op.iLike]: q } },
      { address: { [Op.iLike]: q } },
      { category: { [Op.iLike]: q } },
    ];
  }
  return where;
};

exports.create = async (userId, body, files = []) => {
  const { saveComplaintMedia, deleteComplaintMedia } = require('../utils/mediaStorage');
  const media = await saveComplaintMedia(files);

  try {
    const complaint = await Complaint.create({
      userId,
      title: body.title,
      description: body.description || null,
      category: body.category,
      latitude: body.latitude,
      status: 'pending',
      longitude: body.longitude,
      address: body.address || null,
      media,
    });

    return serialize(complaint);
  } catch (err) {
    await deleteComplaintMedia(media);
    throw err;
  }
};

exports.listMine = async (userId, query) => {
  const where = { userId };
  if (query.status) where.status = query.status;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    include: ASSOCIATIONS,
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    items: rows.map(serialize),
    meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

exports.listResolved = async (query = {}) => {
  const limit = Math.min(20, Math.max(1, Number(query.limit) || 3));
  const category = query.category;

  const where = { status: 'resolved' };
  if (category) where.category = category;

  const rows = await Complaint.findAll({
    where,
    include: [{ model: Category, as: 'categoryRef', attributes: ['id', 'name', 'code'] }],
    order: [['resolvedAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']],
    limit,
    attributes: [
      'id',
      'title',
      'category',
      'address',
      'media',
      'resolvedAt',
      'createdAt',
    ],
  });

  return rows.map((complaint) => {
    const cover = (complaint.media || []).find((m) => m.type === 'image') || null;
    return {
      id: complaint.id,
      title: complaint.title,
      category: complaint.category,
      categoryName: complaint.categoryRef ? complaint.categoryRef.name : complaint.category,
      address: complaint.address,
      coverImage: cover ? toPublicUrl(cover.path) : null,
      resolvedAt: complaint.resolvedAt,
      submittedAt: complaint.createdAt,
    };
  });
};

exports.listAll = async (query) => {
  const where = buildWhere(query);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  const { count, rows } = await Complaint.findAndCountAll({
    where,
    include: ASSOCIATIONS,
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    items: rows.map(serialize),
    meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

exports.getById = async (id) => {
  const complaint = await Complaint.findByPk(id, { include: ASSOCIATIONS });
  if (!complaint) throw new AppError('Complaint not found', 404);
  return serialize(complaint);
};

exports.assign = async (id, assigneeId) => {
  const complaint = await Complaint.findByPk(id, { include: ASSOCIATIONS });
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (assigneeId) {
    const assignee = await User.findByPk(assigneeId, { attributes: ['id', 'name'] });
    if (!assignee) throw new AppError('Assignee not found', 404);
  }

  complaint.assignedTo = assigneeId || null;
  complaint.assignedAt = assigneeId ? new Date() : null;
  if (assigneeId && complaint.status === 'pending') {
    complaint.status = 'in_progress';
  }
  await complaint.save();

  const fresh = await Complaint.findByPk(id, { include: ASSOCIATIONS });
  return serialize(fresh);
};

exports.getDashboard = async () => {
  const [total, pending, inProgress, resolved] = await Promise.all([
    Complaint.count(),
    Complaint.count({ where: { status: 'pending' } }),
    Complaint.count({ where: { status: 'in_progress' } }),
    Complaint.count({ where: { status: 'resolved' } }),
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const trendRows = await Complaint.findAll({
    attributes: [
      [fn('to_char', col('created_at'), 'YYYY-MM'), 'month'],
      [fn('count', col('id')), 'total'],
      [
        fn('count', literal(`CASE WHEN status = 'resolved' THEN 1 END`)),
        'resolved',
      ],
    ],
    where: { createdAt: { [Op.gte]: sixMonthsAgo } },
    group: [fn('to_char', col('created_at'), 'YYYY-MM')],
    order: [[fn('to_char', col('created_at'), 'YYYY-MM'), 'ASC']],
    raw: true,
  });

  const byMonth = Object.fromEntries(trendRows.map((r) => [r.month, r]));
  const trend = [];
  for (let i = 0; i < 6; i += 1) {
    const d = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const row = byMonth[key];
    trend.push({
      month: key,
      label: d.toLocaleString('en-US', { month: 'short' }),
      total: row ? Number(row.total) : 0,
      resolved: row ? Number(row.resolved) : 0,
    });
  }

  const recentRows = await Complaint.findAll({
    include: ASSOCIATIONS,
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  return {
    stats: { total, pending, inProgress, resolved },
    trend,
    recent: recentRows.map(serialize),
  };
};

exports.getAssignableUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email'],
    order: [['name', 'ASC']],
  });
  return users;
};

exports.serialize = serialize;
