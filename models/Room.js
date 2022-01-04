module.exports = (mongoose) => mongoose.model('Room', new mongoose.Schema({
  _id: { type: Number, required: true },
  gameName: { type: String },
  playerIds: { type: [String], required: true }
},
{ collection: 'rooms' }))
