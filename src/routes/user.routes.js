const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');

const { getMe, getUser } = require('../controllers/user.controller');

router.get('/me', auth, getMe);
router.get('/:id', auth, getUser);

module.exports = router;