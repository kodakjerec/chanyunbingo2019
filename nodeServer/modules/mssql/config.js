const sql = require('mssql')
const config = {
  user: 'cys',
  password: 'CYS*6s',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  database: 'cys20160223',
  port: 3306
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
