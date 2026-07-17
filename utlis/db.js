import mongoose from "mongoose";

const DBCon = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xalxakh.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);

    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default DBCon;