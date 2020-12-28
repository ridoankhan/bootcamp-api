const express = require('express');
const router = express.Router();
const {
    getAllBootcamps,
    getSingleBootcamp,
    getBootcampByName,
    getBootcampsInRadius,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteBootcampByName,
    deleteAllBootcamps,
    bootcampPhotoUpload
} = require('../controllers/bootcamps.js');

const Bootcamp = require('../models/Bootcamp.js');

const advancedResults = require('../middleware/advancedResults.js');

// Include resource routers
const courseRouter = require('./courses.js');

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);

// Get bootcamps within given distance of a zipCode
router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router.route('/:id/photo')
    .put(bootcampPhotoUpload)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps) // Get list of all bootcamps
    .post(createBootcamp) // Create a new bootcamp   
    .delete(deleteAllBootcamps) // Delete all bootcamps

router.route('/:id')
    .get(getSingleBootcamp) // Get a single bootcamp with bootcamp id
    .put(updateBootcamp) // Update a bootcamp info with id and data
    .delete(deleteBootcamp) // Delete a bootcamp with an id

router.route('/name/:name')
    .get(getBootcampByName) // Delete a bootcamp by bootcamp-name
    .delete(deleteBootcampByName) // Delete list of all bootcamps


module.exports = router;