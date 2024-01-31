const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', (req,res) => {
    res.send('<h1>Welcome</h1>')
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})