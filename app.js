require('dotenv').config()
const mongoose = require("mongoose")
const express = require('express')
const cors = require('cors')

mongoose.connect(process.env.MONGO_URI).then(console.log("Database is connected")).catch((err) => { console.log(err) })


const app = express()
app.use(express.json())
app.use(cors())

app.get('/' , (req,res)=>{
    res.send("Hello")
})
app.use('/api/v1/user' , require('./routes/user'))
const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log("Listening to port "+port)
})