const router = require('express').Router();
const c = require('../controllers/auth.controller');
const v = require('../validators/auth.validator');
const validate = require('../middlewares/validate');

router.post('/register', validate(v.register), c.register);
router.post('/login', validate(v.login), c.login);

module.exports = router;