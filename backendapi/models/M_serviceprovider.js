const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: [true, "Name is already exists."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User Id is required."],
    },
    subserviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subservices",
      required: [true, "Sub service Id is required."],
    },
    price: {
      type: Number,
      default: 0,
    },
    details: {
      duration: {
        type: String,
      },
      turnaroundtime: {
        type: String,
      },
      pricing: {
        type: String,
        default: "fixed",
      },
      bathroomcleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      kitchencleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      bedroomcleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      sofacleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      carpetcleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      balconycleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      fridgecleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
      overcleaning: {
        type: Boolean,
        enum: [true, false],
        default: true, // true-Included, false-Not_Included
      },
    },
    isactive: {
      type: Boolean,
      enum: [true, false],
      default: true, // true-Active, false-Deactive
    },
  },
  {
    timestamps: true,
  }
);

ServiceProviderSchema.methods.toJSON = function () {
  const serviceProvider = this;
  const serviceProviderObj = serviceProvider.toObject();
  delete serviceProviderObj.__v;
  delete serviceProviderObj.createdAt;
  delete serviceProviderObj.updatedAt;
  return serviceProviderObj;
};

module.exports = mongoose.model("serviceprovider", ServiceProviderSchema);
