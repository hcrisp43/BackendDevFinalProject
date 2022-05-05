const StateList = require('../model/State');
const fs = require('fs');


const getAllStates = async (req, res) => {
    const states = await StateList.find();
    if(!states) return res.status(204).json({ 'message': 'No states found.' });
    res.json(states);
}

const getState = async (req, res) => {
    if(!req?.params?.state) return res.status(400).json({ 'message': 'State code required.' });
    
    const state = await StateList.findOne({ _stateCode: req.verifiedState}).exec();
    if(!state) {
        return res.status(400).json({ "message": `State code ${req.verifiedState} not found`})
    }
    res.json(state);
}

module.exports = {getAllStates, getState};