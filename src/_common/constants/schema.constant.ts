export default function schemaOptions() {
  return {
    id: true,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, converted) => {
        delete converted._id;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, converted) => {
        delete converted._id;
      },
    },
    versionKey: false,
  };
}
