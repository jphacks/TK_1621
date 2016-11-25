const fs = require('fs');
const uuid = require('node-uuid');

module.exports = (data, cb) => {
  const fileName = uuid.v4();
  const imagePath = `image/${fileName}.jpg`
  const decode = new Buffer(data, 'base64');
  fs.writeFile(imagePath, decode, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
    cb(imagePath);
  });
};
