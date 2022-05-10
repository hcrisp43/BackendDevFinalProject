const StateList = require('../model/State');
const fs = require('fs');
const statesJSONData = require('./../model/states.json');


const getAllStates = async (req, res) => {
    const states = await StateList.find();
    if(!states || states.length == 0) return res.status(400).json({ 'message': 'No states found in MongoDB.' });

    //Combine with local data
    /*const allStates = statesJSONData.forEach(state => {
        //Find state in DB object
        const dbState = states.find(st => st.stateCode === state.code);
        console.log(dbState);

        //If found, add funfacts to current state
        if(dbState) state.funfacts = dbState.funfacts;

        //else give it an empty array
        else state.funfacts = [];
    });*/
    let allStates = statesJSONData;
    //console.log(allStates);

    //If contiguous, filter
    if(req.query.contig == "true"){
        allStates = allStates.filter(state => state.code != 'HI' && state.code != 'AK');
    }
    if(req.query.contig == "false"){
        console.log("here");
        allStates = allStates.filter(state => state.code === 'HI' || state.code === 'AK');
    }

    res.json(allStates);
};

const getState = async (req, res) => {
    // Assumes verifyState has passed and state code exists

    //Get state object from MongoDB
    const state = await StateList.findOne({ stateCode: req.code}).exec();
    console.log(state);
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);
    
    //Combine both objects and return
    if(state){
        stateLocalData.funfacts = state.funfacts;
    }
    
    res.json(stateLocalData);
};

const getStateFacts = async(req, res) =>{
    //Get state object from MongoDB
    const state = await StateList.findOne({ stateCode: req.code}).exec();
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    if(!state?.funfacts) {
        res.status(400).json({ 'message': `No Fun Facts found for ${stateLocalData.state}`});
    }
    else{
        //Generate a random index
        //let randIndex = Math.floor(Math.random() * (state.funfacts.length - 1));

        //Return random fun fact
        res.json({ "funfact" : state.funfacts[0] });
    }
    
};

const getStateCapital = async(req, res) =>{
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    res.json({ "state": stateLocalData.state, "capital": stateLocalData.capital_city });
};

const getNickName = async(req, res) =>{
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    res.json({ "state": stateLocalData.state, "nickname": stateLocalData.nickname });
};

const getPopulation = async(req, res) =>{
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    res.json({ "state": stateLocalData.state, "population": stateLocalData.population.toLocaleString("en-US") });
};

const getAdmission = async(req, res) =>{
    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    res.json({ "state": stateLocalData.state, "admitted": stateLocalData.admission_date });
};

const addNewStateFacts = async(req, res) =>{
    if(!req?.body?.funfact) return res.status(400).json({ 'message': 'State fun facts value required'});
    if(req.body.funfact.constructor  !== Array) return res.status(400).json({ 'message': 'State fun facts value must be an array'});

    const state = await StateList.findOne({ stateCode: req.code}).exec();

    //If state has no funfacts in DB, create a new entry
    if(!state || state === null) {
        try{
            const result = await StateList.create({
                stateCode: req.code,
                funfacts: req.body.funfact
            });

            res.status(201).json(result);
        } catch(err){
            console.error(err);
        }
    }

    else {
        //Else append funfacts property from req to fun facts array of state
        state.funfacts = [...state.funfacts, ...req.body.funfact];
        const result = await state.save();
        res.json(result);
    }
    
};

const patchFunFact = async(req, res) => {
    //Check funfact is set
    if(!req?.body?.funfact) return res.status(400).json({ 'message': 'State fun fact value required'});

    //Check if index is set
    if(!req?.body?.index) return res.status(400).json({ 'message': 'State fun fact index value required' });

    //Find DB entry
    const state = await StateList.findOne({ stateCode: req.code}).exec();

    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    if(!state?.funfacts){
        res.status(400).json({ 'message': `No Fun Facts found for ${stateLocalData.state}` });
    }
    else { 
        let factIndex = req.body.index - 1;
        //If index is outside list size, 400 status
        if(factIndex > state.funfacts.length) return res.status(400).json({ 'message': `No Fun Fact found at that index for ${stateLocalData.state}` });

        //Set funfact at index to body of req
        state.funfacts[factIndex] = req.body.funfact;

        //Save and return result
        const result = await state.save();
        res.json(result);
    }
        
};

const deleteFunFact = async(req, res) => {

    //Check if index is set
    if(!req?.body?.index) return res.status(400).json({ 'message': 'State fun fact index value required' });

    //Find DB entry
    const state = await StateList.findOne({ stateCode: req.code}).exec();

    //Get state object from states.json
    const stateLocalData = statesJSONData.find(st => st.code === req.code);

    if(!state?.funfacts){
        res.status(400).json({ 'message': `No Fun Facts found for ${stateLocalData.state}` });
    } 
    else{
        let factIndex = req.body.index - 1;
        //If index is outside list size, 400 status
        if(factIndex > state.funfacts.length) return res.status(400).json({ 'message': `No Fun Fact found at that index for ${stateLocalData.state}` });

        //Delete funfact at index
        state.funfacts.splice(factIndex, factIndex);


        //Save and return result
        const result = await state.save();
        res.json(result);
    }
    
};

module.exports = {
    getAllStates, 
    getState,
    getStateFacts, 
    getStateCapital, 
    getNickName, 
    getPopulation, 
    getAdmission, 
    addNewStateFacts, 
    patchFunFact,
    deleteFunFact
};