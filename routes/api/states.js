const express = require('express');
const router = express.Router();
const verifier = require('../../middleware/verifyState');
const statesController = require('../../controllers/statesController');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});


router.route('/states').get(statesController.getAllStates);

router.route('/states/:state').get(verifier, statesController.getState);
module.exports = router;