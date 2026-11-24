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
 *               category: { type: string, enum: [Roads, Streetlights, Garbage, Water Supply, Drainage] }
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
 * /complaints/my-complaint:
 *   get:
 *     tags: [Complaints]
 *     summary: List the logged-in user's complaints
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Pending, In Progress, Resolved, Rejected] }
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
 *         schema: { type: string, enum: [ROADS, STREETLIGHTS, GARBAGE, WATER, DRAINAGE] }
 *     responses:
 *       200: { description: Recently resolved complaints }
 */
router.get('/resolved', validate(v.resolvedQuery, 'query'), c.listResolved);

module.exports = router;
