const express = require('express')
const router = express.Router()
const { sql, poolPromise } = require('./config')

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .input('input_parameter', sql.Int, req.query.input_parameter)
      .query('select * from line_cell where line_id = @input_parameter')

    res.json(result.recordset)
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }
})

module.exports = router
