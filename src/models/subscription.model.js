import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    channel: {
        type: Schema.Types.ObjectId,  // One to whom subscriber is subscribing
        ref: "User"

    },
    subscriber: {
        type: Schema.Types.ObjectId,  // One who is subscribing the channel
        ref: "User"
    }
}, { timestamps: true })


export const Subscription = mongoose.model("Subscription", subscriptionSchema)