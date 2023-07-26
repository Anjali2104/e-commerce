const mongoose = require('mongoose')
const connecTodb = () =>{
    mongoose
     .connect(process.env.MONGO_URI)
     .then((conn)=>console.log(`Connected to ${conn.connection.host}`))
     .catch((e) => console.log(e.message))
}
module.exports = connecTodb;