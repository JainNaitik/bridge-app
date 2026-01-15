import mongoose from "mongoose";
const { Schema } = mongoose;

const summarySchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    originalText: String,
    summaryText: String,
    type: { type: String, default: 'text' },
    date: { type: Date, default: Date.now },
});

mongoose.model("summaries", summarySchema);
