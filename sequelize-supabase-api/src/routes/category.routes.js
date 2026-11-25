const router = require('express').Router();
const c = require('../controllers/category.controller');
const v = require('../validators/category.validator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List complaint categories
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema: { type: string, enum: ['true', 'false'] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50, maximum: 50 }
 *     responses:
 *       200: { description: Paginated categories }
 *       401: { description: Not authenticated }
 */
router.get('/', auth, validate(v.listQuery, 'query'), c.list);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a category
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Parks }
 *               code: { type: string, example: PARKS }
 *               active: { type: boolean, default: true }
 *     responses:
 *       201: { description: Category created }
 *       401: { description: Not authenticated }
 *       409: { description: Code already exists }
 */
router.post('/', auth, validate(v.create), c.create);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Update a category
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
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               active: { type: boolean }
 *     responses:
 *       200: { description: Category updated }
 *       401: { description: Not authenticated }
 *       404: { description: Not found }
 *       409: { description: Code already exists }
 */
router.patch('/:id', auth, validate(v.idParam, 'params'), validate(v.update), c.update);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete an unused category
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Deleted }
 *       401: { description: Not authenticated }
 *       404: { description: Not found }
 *       409: { description: Category is in use }
 */
router.delete('/:id', auth, validate(v.idParam, 'params'), c.remove);

module.exports = router;
