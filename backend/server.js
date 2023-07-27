const app = require('./app');
const dotenv = require('dotenv')
const connecTodb = require('./config/database')
//Handling Uncaught Exception
process.on("uncaughtException",(err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Uncaught exception`);
    process.exit(1);
})
dotenv.config({path:'backend/config/sensitive.env'})

connecTodb();
const PORT = process.env.PORT || 4007;
 const server = app.listen(PORT, () => {
console.log(`server is listening on http://localhost:${PORT}`);
});

//Unhandled Promise rejection
process.on("unhandledRejection", (err) =>{
 console.log(`Error : ${err.message}`);
 console.log(`Shutting down the server due to unhandled Promise Rejection`);
 server.close(() => {
    process.exit(1);
 })
});