/***************************************************************************************
 *                                        DEPENDENCIES
 **************************************************************************************/
require('dotenv').config();
require('./config/database')
const express = require('express');
const cors = require('cors')
const morgan = require('morgan')



const charactersRouter = require('./routes/characters');
const usersRouter = require('./routes/users');






















/***************************************************************************************
 *                                        APP CONFIG
 **************************************************************************************/
const { PORT } = process.env


const app = express()































/***************************************************************************************
 *                                        MIDDLEWARE
 **************************************************************************************/
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))






























/***************************************************************************************
 *                                        ROUTER MIDDELWARE
 **************************************************************************************/
// app.get('/', (req, res)=> {
//     res.send('hello world')
// });

app.use('/api', charactersRouter);
app.use('/users', usersRouter);




























/***************************************************************************************
 *                                        SERVER
 **************************************************************************************/


app.listen(PORT, ()=> console.log(`Listening on port: ${PORT}`))