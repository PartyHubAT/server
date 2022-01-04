module.exports = async (mongoose) => {
  console.log(`Connecting to mongo-db (${process.env.DBCONNECTION})...`)
  await mongoose.connect(process.env.DBCONNECTION)
  console.log('Connected to mongo-db.')
  if (process.env.RESETDBONLAUNCH) {
    await mongoose.connection.db.dropDatabase()
    console.log('Reset db.')
  }
}
