const Terser = require("terser");

const code = `
function add(a, b) {
  return a + b;
}
`;

async function minifyCode() {
  try {
    const result = await Terser.minify(code, {
      sourceMap: {
        filename: "out.js",
        url: "out.js.map",
      },
    });

    if (result.error) {
      console.log("Error:", result.error);
    } else {
      console.log("Minified code:", result.code);
      console.log("Source map:", result.map);
    }
  } catch (err) {
    console.log("Error during minification:", err);
  }
}

minifyCode();
