const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:127.0.0.1/projectWeb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('Connect Successfully!!!');
  } catch (error) {
    console.log('Connect Failly!!');
  }
}
module.exports = { connect };