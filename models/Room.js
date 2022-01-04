module.exports = (mongoose) => mongoose.model('Room', new mongoose.Schema({
  _id: { type: Number, required: true },
  gameName: { type: String },
  players: { type: [Object], required: true }
},
{ collection: 'rooms' }))
