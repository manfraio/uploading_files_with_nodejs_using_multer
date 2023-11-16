const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

const memoryStorage = multer({
    storage: multer.memoryStorage()
})

app.post('/memory', memoryStorage.single('file'), (req, res) => {
    // Validate file format
    if (file.mimetype != 'application/pdf') {
        return res.send('File is not a .pdf')
    }  

    // Checking and creating the directory
    const dir = 'files'
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }

    // Building file name
    const filename = Date.now() + path.extname(req.file.originalname)

    // Save the file to direcoty
    fs.writeFileSync(dir + '/' + filename, req.file.buffer)

    res.send('Success')
})

app.listen(3000, () => console.log('Server started on port 3000'))