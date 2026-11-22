const router = require('express').Router();
const c = require('../controllers/user.controller');
const v = require('../validators/user.validator');
const validate = require('../middlewares/validate');

router.get('/', validate(v.listQuery, 'query'), c.list);
router.get('/:id', validate(v.idParam, 'params'), c.get);
router.post('/', validate(v.create), c.create);
router.patch('/:id', validate(v.idParam, 'params'), validate(v.update), c.update);
router.delete('/:id', validate(v.idParam, 'params'), c.remove);

module.exports = router;
