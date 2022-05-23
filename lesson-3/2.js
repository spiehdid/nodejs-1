const fs = require("fs");
const { Transform } = require("stream");

const SOURCE_FILE_NAME = "./access.log";
const IP_LIST = ["89.123.1.41", "34.48.240.111"];

const getOutputFileName = (ip) => `./${ip}_requests.log`;

const readStream = fs.createReadStream(SOURCE_FILE_NAME, "utf-8");

IP_LIST.forEach((ip) => {
  const regExp = new RegExp("^" + ip + ".*$", "gm");
  const outputFileName = getOutputFileName(ip);

  const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
      const transformedChunk = chunk.toString().match(regExp).join("\n");
      callback(null, transformedChunk);
    },
  });

  const writeStream = fs.createWriteStream(outputFileName, "utf-8");

  readStream.pipe(transformStream).pipe(writeStream);
});
