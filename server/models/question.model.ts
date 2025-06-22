import mongoose, { Document, Schema } from 'mongoose';

interface Question {
  id: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TriviaData {
  results: Question[];
}

interface TriviaTable extends Document {
  userId: string;
  title: string;
  data: TriviaData;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<Question>({
  id: { type: String, required: true },
  category: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: { type: [String], required: true },
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
});

const TriviaDataSchema = new Schema<TriviaData>({
  results: { type: [QuestionSchema], required: true }
});

const TriviaTableSchema = new Schema<TriviaTable>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  data: { type: TriviaDataSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<TriviaTable>('TriviaTable', TriviaTableSchema);