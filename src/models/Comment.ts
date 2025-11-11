import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './Task';

export interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId | ITask;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IComment>('Comment', commentSchema);
