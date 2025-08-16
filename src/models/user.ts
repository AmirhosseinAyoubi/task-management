import mongoose, {Document, Schema} from "mongoose";
import {emailValidationRe} from "../constants/regexes";
import bcrypt from 'bcryptjs'

enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager'
}

export interface IUser extends Document {
    username: string,
    email: string,
    password: string
    firstName?: string,
    lastName?: string,
    role: UserRoles,
    team: mongoose.Types.ObjectId[],
    isActive: boolean,
    lastLogin?: Date,
    createdAt: Date,
    updatedAt: Date,
    fullName: string,
    teamSize: number

    comparePassword(candidatePassword: string): Promise<boolean>;

    toJSON(): any;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [emailValidationRe, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.USER
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

userSchema.virtual('fullName').get(function (this: IUser) {
    if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
        return this.firstName
    } else if (this.lastName) {
        return this.lastName
    }
    return this.username
})

userSchema.virtual('teamSize').get(function (this: IUser) {
    return this.team ? this.team.length : 0;
});

userSchema.index({email: 1});
userSchema.index({username: 1});
userSchema.index({role: 1});
userSchema.index({isActive: 1});

userSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (e) {
        next(e as Error)
    }
})

userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function(this: IUser) {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User