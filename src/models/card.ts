import mongoose from 'mongoose';
import regExpUrl from '../utils/constants';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId,
  likes: mongoose.Types.ObjectId[],
  createdAt: Date,
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: regExpUrl,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);