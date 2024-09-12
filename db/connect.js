import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = () => {
  const url = "mongodb+srv://atulrajput:atul123@cluster0.9gsof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default connectDB;
