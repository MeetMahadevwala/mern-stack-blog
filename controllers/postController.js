const Post = require('../models/postModel');

const createPost = async (req, res) => {

    try {

        const { title, markdownContent, categories,  author } = req.body;

        if (!title || !markdownContent) {
            return res.status(400).json({ message: 'Please provide a title and content for the post.' });
        }

        const newPost = await Post.create({
            title,
            markdownContent,
            categories,
            author
        });

        res.status(201).json(newPost);

    }

    catch (error) {

        // console.error(error);
        // res.status(400).json({ message: 'Error creating post', error: error.message });

        res.status(400).json({ message: 'Error creating post', error: error.message})
    }
};

// const getAllPost = async (req, res) => {

//     try {

//         const posts = await Post.find({}).sort({ createdAt: -1 });

//         res.status(200).json(posts);

//     }
//     catch (error) {

//         console.error(error);
//         res.status(500).json({ message: 'Error fetching posts', error: error.message });

//     }

// };

// Get all posts with pagination
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPost = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1})
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPost / limit),
            totalPost,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

const getPostById = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }

    }
    catch (error) {

        console.error(error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
        }

        res.status(500).json({ message: 'Error fetching post', error: error.message });

    }

};

//  changes link adress for SEO
const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug});

        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message});
    }
};

const updatePost = async (req, res) => {

    try {
        const { title, markdownContent, categories } = req.body;

        const updatedData = {
            title,
            markdownContent,
            categories,
        };


        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedPost){
            res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);

    } 
    catch (error) {
    
        // console.error(error);

        // if (error.name === 'CastError'){
        //     return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
        // }
        // if (error.name === 'ValidationError') {
        //     return res.status(400).json({ message: 'Validation Error', error: error.message});
        // }

        // res.status(500).json({ message: 'Error updating post', error: error.message });

        res.status(400).json({ message: 'Error updating post', error: error.message});

    }

};

const deletePost = async (req, res) => {

    try {
        
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (deletePost){
            res.status(200).json({ message: 'Post deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }

    } catch (error) {
        
        console.error(error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
        }

        res.status(500).json({ message: 'Error deleting post', error: error.message });

    }

};

const getPostByCategory = async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const posts = await Post.find({ categories: categoryName })
            .sort({ createdAt: -1 });
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost,
    getPostByCategory,
};