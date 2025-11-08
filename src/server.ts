import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://berguigbinyamin:admin@cluster0.gbv3omc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log(process.env.PORT);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database connection error:', err));
