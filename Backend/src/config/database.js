const mongoose = require('mongoose');

//create connection with the Cluster
async function main() {                                                                                 //here college is a database
  await mongoose.connect(process.env.DATABASE_KEY);

}
module.exports=main;