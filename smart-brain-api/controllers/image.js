const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'bc796d7912444a55b3bd84142e68d852'
});

const handleAPIcall = (req,res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input).then(data =>{
        res.json(data);
    }).catch(err => {res.status(400).json('unable to work with api')})
};


const handleImage = (req,res,db) => {
    const {id} = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries').then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get'))
};

module.exports= {
    handleImage:handleImage,
    handleAPIcall:handleAPIcall
};