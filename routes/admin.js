const path = require('path');
const express = require('express');
const adminCon = require('../controllers/admin'); 
const router = express.Router();

const multer = require('multer');
let upload = multer();

router.get('/dataset', adminCon.datasetPage);

router.post('/dataset/upload', upload.single('dataset'), adminCon.uploadDataset);

module.exports = router;