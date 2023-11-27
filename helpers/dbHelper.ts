import * as mongoose from "mongoose";

export class DbHelper {
  private static async connect() {
    await mongoose
      .connect(
        "mongodb://testUser:qwerty12345@5.189.186.217:27017/admin?authMechanism=DEFAULT"
      )
      .then(() => {
        console.log("Mongo is connected");
      })
      .catch((error) => console.log(error));
  }

  static async getCategories(categoryId) {
    await this.connect();
    const categorySchema = new mongoose.Schema({
    //   user: {
    //     ref: "users",
    //     type: mongoose.Schema.Types.ObjectId,
    //   },
      //   _id: {
      //     type: String
      //   },
      //   __v: {
      //     type: Number
      //   }
    });
    const categoryModel = mongoose.model("categories", categorySchema);
    const result = await categoryModel.findById(categoryId);
    await mongoose.disconnect();
    return result;
  }
}
