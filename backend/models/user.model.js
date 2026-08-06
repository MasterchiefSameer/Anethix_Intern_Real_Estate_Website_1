import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    role: {
        type: String,
        enum: ['Tenant', 'Manager'],
        default: 'Tenant',
    },
    favorites: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
        default: [],
    },
}, { timestamps: true}
);

//model creation
const User = mongoose.model('User', userSchema);

//exporting the model
export default User;