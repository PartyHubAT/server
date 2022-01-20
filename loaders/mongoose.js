/**
 * Connects to the mongodb database
 * @param {module:mongoose} mongoose The servers mongoose instance
 * @returns {Promise}
 */
async function loadMongoose (mongoose) {
  console.log(`Connecting to mongo-db (${process.env.DBCONNECTION})...`)
  await mongoose.connect(process.env.DBCONNECTION)
  console.log('Connected to mongo-db.')
  if (process.env.RESETDBONLAUNCH && JSON.parse(process.env.RESETDBONLAUNCH)) {
    const collections = await mongoose.connection.db.collections()
    const DELETECOLLECTIONS = ['players', 'rooms', 'games']
    for (const collection of collections) {
      if (DELETECOLLECTIONS.some(c => collection.namespace.includes(c))) await collection.deleteMany({})
    }
    console.log('Reset database and all collections.')
  }
}

module.exports = loadMongoose
