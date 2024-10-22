import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true,
    },
    password:{
        type: Schema.Types.String,
        required: true,
    },
    displayname:{
        type: Schema.Types.String,
    }
})

export const User = mongoose.model("Users", UserSchema);
