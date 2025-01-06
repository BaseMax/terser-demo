const Terser = require("terser");

const code = `
function add(a, b) {
  return a + b;
}
`;

Terser.minify(code).then(result => {
  if (result.error) {
    console.log("Error:", result.error);
  } else {
    console.log("Minified code:", result.code);
  }
}).catch(err => {
  console.log("Error during minification:", err);
});
