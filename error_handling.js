const express = require('express')
const multer = require('multer')

const app = express()

const upload = multer().array('files', 2)

app.post('/error', (req, res) => {
    filesUpload(req, res, function(error) {
        console.log(error)

        if (error) {
            return res.send('Error: ' + error)
        } else {
            return res.send('success')
        }
        
    })
})

app.listen(3000, () => console.log('Server started on port 3000'))