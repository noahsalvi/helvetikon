// TODO test if this isn't needed anymore
import fs from "fs";

const path = "./node_modules/@prisma/client/index-browser.js";

fs.writeFileSync(
  path,
  `const prisma = require('../../.prisma/client/index-browser');
  module.exports = prisma
`
);
