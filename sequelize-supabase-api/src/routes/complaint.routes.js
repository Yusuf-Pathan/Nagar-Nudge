const router = require('express').Router();
const c = require('../controllers/complaint.controller');
const v = require('../validators/complaint.validator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { uploadComplaintMedia } = require('../middlewares/upload');

/**
 * @openapi
 * /complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Raise a complaint with optional images or videos
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, category, latitude, longitude]
 *             properties:
 *               title: { type: string, example: Pothole on MG Road }
 *               description: { type: string }
 *               category: { type: string, example: ROADS }
 *               latitude: { type: number, example: 23.0225 }
 *               longitude: { type: number, example: 72.5714 }
 *               address: { type: string }
 *               media:
 *                 type: array
 *                 maxItems: 5
 *                 items: { type: string, format: binary }
 *     responses:
 *       201: { description: Complaint created }
 *       400: { description: Validation or upload error }
 *       401: { description: Not authenticated }
 */
router.post('/', auth, uploadComplaintMedia, validate(v.create), c.create);

/**
 * @openapi
 * /complaints:
 *   get:
 *     tags: [Complaints]
 *     summary: List all complaints (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in_progress, resolved, rejected] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: assigned
 *         schema: { type: string, enum: ['true', 'false'] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *     responses:
 *       200: { description: Paginated list of all complaints }
 *       401: { description: Not authenticated }
 */
router.get('/', auth, validate(v.listAllQuery, 'query'), c.listAll);

/**
 * @openapi
 * /complaints/dashboard:
 *   get:
 *     tags: [Complaints]
 *     summary: Admin dashboard stats, 6-month trend, and recent complaints
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard payload }
 *       401: { description: Not authenticated }
 */
router.get('/dashboard', auth, c.dashboard);

/**
 * @openapi
 * /complaints/assignable-users:
 *   get:
 *     tags: [Complaints]
 *     summary: List users that complaints can be assigned to
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 *       401: { description: Not authenticated }
 */
router.get('/assignable-users', auth, c.assignableUsers);

/**
 * @openapi
 * /complaints/my-complaint:
 *   get:
 *     tags: [Complaints]
 *     summary: List the logged-in user's complaints
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in_progress, resolved, rejected] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *     responses:
 *       200: { description: List of complaints }
 *       401: { description: Not authenticated }
 */
router.get('/my-complaint', auth, validate(v.myComplaintsQuery, 'query'), c.listMine);

/**
 * @openapi
 * /complaints/resolved:
 *   get:
 *     tags: [Complaints]
 *     summary: List recently resolved complaints (public)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 3, minimum: 1, maximum: 20 }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recently resolved complaints }
 */
router.get('/resolved', validate(v.resolvedQuery, 'query'), c.listResolved);

/**
 * @openapi
 * /complaints/{id}:
 *   get:
 *     tags: [Complaints]
 *     summary: Get a single complaint by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Complaint detail }
 *       401: { description: Not authenticated }
 *       404: { description: Not found }
 */
router.get('/:id', auth, validate(v.idParam, 'params'), c.get);

/**
 * @openapi
 * /complaints/{id}/assign:
 *   patch:
 *     tags: [Complaints]
 *     summary: Assign or unassign a complaint
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assigneeId]
 *             properties:
 *               assigneeId:
 *                 oneOf:
 *                   - type: string
 *                     format: uuid
 *                   - type: 'null'
 *                 example: 3f1c8f2a-0000-4000-8000-000000000001
 *     responses:
 *       200: { description: Updated complaint }
 *       400: { description: Invalid assignee }
 *       401: { description: Not authenticated }
 *       404: { description: Complaint not found }
 */
router.patch('/:id/assign', auth, validate(v.idParam, 'params'), validate(v.assign), c.assign);

module.exports = router;
