import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database Connection Error' });
  }
});

// Journal Schema & Model
const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Journal = mongoose.model('Journal', journalSchema);

// Routes

// Get all journals
app.get('/api/journals', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new journal
app.post('/api/journals', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const journal = new Journal({
    title,
    content,
  });

  try {
    const newJournal = await journal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a journal
app.delete('/api/journals/:id', async (req, res) => {
  try {
    const journal = await Journal.findByIdAndDelete(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    res.json({ message: 'Journal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analyze journals with AI
app.post('/api/analyze-journals', async (req, res) => {

  try {
    const journals = await Journal.find().sort({ createdAt: -1 }).limit(10); // Analyze last 10 entries

    if (journals.length === 0) {
      return res.status(400).json({ message: 'No journals to analyze' });
    }

    const journalContent = journals.map(j => `Date: ${j.createdAt}\nTitle: ${j.title}\nContent: ${j.content}`).join('\n\n');

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [
        {
          role: "system",
          content: "You are an empathetic mental health assistant. Analyze the following journal entries and provide a brief summary of the user's mood, potential stressors, and 3 actionable, positive suggestions. Keep the tone supportive and warm. Format the response in standard markdown."
        },
        {
          role: "user",
          content: `Here are my recent journal entries:\n\n${journalContent}`
        }
      ],
    });

    res.json({ analysis: completion.choices[0].message.content });
  } catch (err) {
    console.error('AI Analysis Error:', err);
    res.status(500).json({ message: 'Failed to analyze journals' });
  }
});

// Start Server locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
