module.exports = (mongoose) => mongoose.model('Game', new mongoose.Schema({
  name: { type: String, required: true }
},
{ collection: 'games' }))
