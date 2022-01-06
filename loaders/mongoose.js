﻿/**
 * Connects to the mongodb database
 * @param mongoose The servers mongoose instance
 * @returns {Promise<void>}
 */
module.exports = async (mongoose) => {
  console.log(`Connecting to mongo-db (${process.env.DBCONNECTION})...`)
  await mongoose.connect(process.env.DBCONNECTION)
  console.log('Connected to mongo-db.')
  if (process.env.RESETDBONLAUNCH && JSON.parse(process.env.RESETDBONLAUNCH)) {
    const collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
    console.log('Reset database and all collections.')
  }
}
