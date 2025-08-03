const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            require:true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next (error);
    }
});

userSchema.methods.matchPassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;