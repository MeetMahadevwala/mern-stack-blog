const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide a username and password.',
            });
        }

        const user = await User.findOne({username}).select('+password');

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign(
                { id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                _id: user._id,
                username: user.username,
                token,
            });
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials',
            });
        }

        // if (!user || !(await user.comparePassword(password))) {
        //     return res.status(401).json({
        //         status: 'fail',
        //         message: 'Invalid credentials.',
        //     });
        // }

        // const payload = {id: user._id};

        // const token = jwt.sign(payload, process.env.JWT_SECRET, {
        //     expiresIn: process.env.JWT_EXPIRES_IN,  
        // });

        // res.status(200).json({
        //     status: 'Success',
        //     token,
        // });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({
            status: 'error',
            message: 'An Internal server error occured.'
        }); 
    }
};