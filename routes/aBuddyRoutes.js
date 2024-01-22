const router = require('express').Router();
const abuddyController = require('./abuddyController');

router.post('/buddy', async (req,res) => {
    abuddyController.buddy(req, res, next);
});

module.exports = router;