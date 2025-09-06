import mongoose from "mongoose";

const sourceSubCountSchema = new mongoose.Schema(
  {
    sourceId: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        const customRet = ret;
        delete customRet._id;
        delete customRet.__v;
        delete customRet.password;
        return customRet;
      },
    },
  }
);

const SourceSubCount = mongoose.model("SourceSubCount", sourceSubCountSchema);

export default SourceSubCount;
