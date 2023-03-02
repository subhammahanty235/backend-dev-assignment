require('dotenv').config()
const mongoose = require("mongoose")
const express = require('express')
const cors = require('cors')

const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI,()=>{
        console.log("Connection to dataBase successful");
    })
}
connectToDB();
const app = express()
app.use(express.json())
app.use(cors())

app.get('/' , (req,res)=>{
    res.send("Hello")
})
app.use('/api/v1/user' , require('./routes/bookstoreroute'))
const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log("Listening to port "+port)
})