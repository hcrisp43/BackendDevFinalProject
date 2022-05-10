const statesJSONData = require('./../model/states.json');

const verifyState = async (req, res, next) => {
    const stateAbbr = req.params.state.toUpperCase();
    
    // Obtain array of state abbreviations
    const stateCodes = statesJSONData.map(st => st.code);

    const isState = stateCodes.find(code => code === stateAbbr);

    if(!isState){
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter'});
    }

    req.code = stateAbbr;
    next();
};

module.exports = verifyState;