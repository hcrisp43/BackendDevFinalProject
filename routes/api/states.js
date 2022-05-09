const express = require('express');
const router = express.Router();
const verifier = require('../../middleware/verifyState');
const statesController = require('../../controllers/statesController');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'));
});


router.route('/states').get(statesController.getAllStates);

router.route('/states/:state').get(verifier, statesController.getState);


router.route('/states/:state/funfact')
    .get(verifier, statesController.getStateFacts)
    .post(verifier, statesController.addNewStateFacts)
    .patch(verifier, statesController.patchFunFact)
    .delete(verifier, statesController.deleteFunFact)
;

router.route('/states/:state/capital').get(verifier, statesController.getStateCapital);
router.route('/states/:state/nickname').get(verifier, statesController.getNickName);
router.route('/states/:state/population').get(verifier, statesController.getPopulation);
router.route('/states/:state/admission').get(verifier, statesController.getAdmission);

module.exports = router;