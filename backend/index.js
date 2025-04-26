//
require('dotenv').config({
    path:'./.env'
  })
  const app = require('./app.js')
  
  const  connectdb = require('./db/coonection.js')
  
  connectdb().then(()=>{
    app.listen(process.env.PORT, function(req, res){
      console.log("running ")
    })
  })