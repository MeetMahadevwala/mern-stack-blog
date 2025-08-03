const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'A post must have title.'],
        trim: true
    },

    slug: {
        type: String,
        unique: true,
    },

    markdownContent: {
        type: String,
        required: [true, 'A post must have content.']
    },

    categories: {
        type: [String],
        default: [],
    },

    author: {
        type: String,
        default: 'Admin'
    },

    },
    {
        timestamps: true,
    }
);

postSchema.pre('save', function(next) {
    if(this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true});
    }

    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;