const { Complaint } = require('../models');
const { saveComplaintMedia, deleteComplaintMedia, toPublicUrl } = require('../utils/mediaStorage');

const serialize = (complaint) => ({
  id: complaint.id,
  title: complaint.title,
  description: complaint.description,
  category: complaint.category,
  status: complaint.status,
  address: complaint.address,
  location: {
    latitude: Number(complaint.latitude),
    longitude: Number(complaint.longitude),
  },
  media: (complaint.media || []).map((m) => ({ type: m.type, url: toPublicUrl(m.path) })),
  submittedAt: complaint.createdAt,
  resolvedAt: complaint.resolvedAt,
});

exports.create = async (userId, body, files = []) => {
  // Upload first so the database row never points to missing files
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
    order: [['createdAt', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    items: rows.map(serialize),
    meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

exports.serialize = serialize;
