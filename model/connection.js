const mongoose = require('mongoose');

const URI ="mongodb+srv://user1:user1@cluster0.tsoml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true";

// console.log('11111');

console.log(mongoose.connect(URI , {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}));

const connectDB = async () => {
  await mongoose.connect(URI , {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;
