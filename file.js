const fs = require("fs");
const Terser = require("terser");

const inputFilename = "example-code.txt.js";
const outputFilename = "example-code.js";

fs.readFile(inputFilename, "utf8", (err, code) => {
  if (err) {
    console.log("Error reading the file:", err);
    return;
  }

  Terser.minify(code).then(result => {
    if (result.error) {
      console.log("Error during minification:", result.error);
    } else {
      fs.writeFile(outputFilename, result.code, (err) => {
        if (err) {
          console.log("Error writing to the output file:", err);
        } else {
          console.log(`Minified code has been saved to ${outputFilename}`);
        }
      });
    }
  }).catch(err => {
    console.log("Error during minification:", err);
  });
});
