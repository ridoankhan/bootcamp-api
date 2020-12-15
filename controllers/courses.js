const ErrorResponse = require('../utils/errorResponse.js');
const Course = require('../models/Course.js');
const asyncHandler = require('../middleware/async.js');

// @Desc    to get courses
// @Route   GET /api/v1/courses
// @Route   GET /api/v1/bootcamps/:bootcampId/courses
// @Access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        }).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})