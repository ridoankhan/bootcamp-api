const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please enter a course title']
    },
    description: {
        type: String,
        required: [true, 'Please enter a course description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please enter tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please a minimum skill level for the course'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

// Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log(`Calculating averge cost`.blue);

    const obj = await this.aggregate([{
        $match: {
            bootcamp: bootcampId
        }
    },
    {
        $group: {
            _id: '$bootcamp',
            averageCost: {
                $avg: '$tuition'
            }
        }
    }
    ]);
    // console.log(obj);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.log(err);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp)
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp)
});

module.exports = mongoose.model('Course', CourseSchema);