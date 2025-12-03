const fs = require("fs");
const readline = require("readline");
const path = require("path");

// Max chunk limit for CXone Studio
const MAX_CHUNK = 28000;

// Full safe character escape table
const CHAR_MAP = {
  '"': "{char(34)}",
  // "'": "{char(39)}",
  "{": "{{",  // "{char(123)}",
  // "}": "{char(125)}",
  // "$": "{char(36)}",
  // "%": "{char(37)}",
  // "&": "{char(38)}",
  // "\\": "{char(92)}"
};

// escape ALL special characters for CXone-safe rendering
function escapeSpecialChars(str) {
  // return str.replace(/["'{}$%&\\]/g, match => CHAR_MAP[match]);
  return str.replace(/["{]/g, match => CHAR_MAP[match]);
}

// Special handling for <script> blocks:
function protectScriptBlocks(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, block => {
    let safe = escapeSpecialChars(block);
    // safe = safe.replace(/</g, "{char(60)}").replace(/>/g, "{char(62)}");
    return safe;
  });
}

function convertHtmlToCxoneScript(html) {
  // html = protectScriptBlocks(html);

  const lines = html.split(/\r?\n/);
  let combined = "";

  lines.forEach(line => {
    if (!line.trim()) return;

    const safe = escapeSpecialChars(line.trim())
      // .replace(/</g, "{char(60)}")
      // .replace(/>/g, "{char(62)}");

    combined += safe; //  + "\\n";
  });

  return combined;
}

function chunkScript(str) {
  let script = 'ASSIGN formCode=""\n';
  // let script = 'ASSIGN formCode=""';
  let pos = 0;

  while (pos < str.length) {
    const chunk = str.substring(pos, pos + MAX_CHUNK);
    // script += `formCode.append("${chunk}")\n`;
    script += `formCode.append("${chunk}")`;
    pos += MAX_CHUNK;
  }
  return script;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter input HTML file path: ", function(inputPath) {
  rl.question("Enter output file name (default: cxoneOutput.txt): ", function(outputFileName) {

    const htmlFilePath = path.resolve(inputPath);
    const outputName = outputFileName.trim() || "cxoneOutput.txt";

    try {
      console.log("\nReading HTML file...");
      const html = fs.readFileSync(htmlFilePath, "utf8");

      console.log("Escaping special characters...");
      const safeHtml = convertHtmlToCxoneScript(html);

      console.log("Chunking for CXone limits...");
      const result = chunkScript(safeHtml);

      fs.writeFileSync(outputName, result);

      console.log(`\n🎉 SUCCESS — CXone Script Generated: ${outputName}\n`);
    } catch (err) {
      console.error("\n❌ ERROR: " + err.message);
    }

    rl.close();
  });
});
