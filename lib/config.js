const path = require('path');
const fs = require('fs');

const configFilePath = path.join(process.cwd(), '.umm.json');

if (fs.existsSync(configFilePath)) {
  const data = fs.readFileSync(configFilePath);
  module.exports = JSON.parse(data);
} else {
  module.exports = {};
}
