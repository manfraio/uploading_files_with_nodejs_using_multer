const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

/* SINGLE FILE */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'uploads'

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        cb(null, dir)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = function(req, file, cb) {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    } else {
        req.errorMessage = 'File is not a valid image!'
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter })

app.post('/', upload.single('image'), (req, res) => {
    console.log(req.body)
    if (req.errorMessage) {
        return res.send(req.errorMessage)
    }

    return res.send('File uploaded')
})


/* MULTIPLE FILES*/
const uploadDocuments = multer({
    storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype == 'application/pdf') {
            cb(null, true)
        } else {
            !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname)
            cb(null, false)
        }   
    }
})

app.post('/multiple-files', uploadDocuments.array('documents', 4), (req, res) => {
    if (req.invalidFiles) {
        return res.status(200).json({
            warning: true,
            message: 'Some files did not uploaded due to wrong format: ' + req.invalidFiles.join(', ')
        })
    }

    return res.status(200).json({
        warning: false,
        message: 'Files uploaded successfully'
    })
})


/* MULTIPLE FIELDS */
const uploadProfile = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            const dir = 'profile'
    
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
    
            cb(null, dir)
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname))
        }
    }),
    fileFilter: function(req, file, cb) {
        let acceptFile = true

        if (file.fieldname == 'avatar' || file.fieldname == 'banner') {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
                acceptFile = true
            }
        } else if (file.fieldname == 'document') {
            if (file.mimetype == 'application/pdf') {
                acceptFile = true
            }
        }

        if (!acceptFile) {
            const message = `Field ${file.fieldname} wrong type (${file.mimetype})`
            !req.invalidFiles ? req.invalidFiles = [message] : req.invalidFiles.push(message)
        }

        cb(null, acceptFile)
    }
})

const fields = [
    {
        name: 'profile',
        maxCount: 1
    },
    {
        name: 'banner',
        maxCount: 1
    },
    {
        name: 'document',
        maxCount: 1
    }    
]

app.post('/multiple-fields', uploadProfile.fields(fields), (req, res) => {
    if (req.invalidFiles) {
        return res.status(200).json({
            warning: true,
            message: 'Some files did not uploaded: ' + req.invalidFiles.join(', ')
        })
    }

    return res.status(200).json({
        warning: false,
        message: 'Files uploaded successfully'
    })
})

app.listen(3000, () => console.log('Server started on port 3000'))