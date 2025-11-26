const fs = require("fs");
const path = require("path");

function convertHtmlToCxoneScript(html) {
  let script = 'ASSIGN formCode=""\n';

  const lines = html.split(/\r?\n/);

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.length === 0) return;

    // replace normal quotes with {char(34)}
    const converted = trimmed.replace(/"/g, "{char(34)}");
    script += `formCode.append("${converted}")\n`;
  });

  return script;
}

function generateScriptFromFile(htmlFilePath, outputFilePath = "cxoneScript.txt") {
  try {
    const html = fs.readFileSync(path.resolve(htmlFilePath), "utf8");

    console.log("HTML file loaded successfully... converting...");
    const result = convertHtmlToCxoneScript(html);

    fs.writeFileSync(outputFilePath, result);
    console.log(`CXone script file generated: ${outputFilePath}`);
  } catch (error) {
    console.error("Error processing file:", error.message);
  }
}

// Call function: First argument = HTML file, second = output file name
generateScriptFromFile("form.html", "cxoneOutput.txt");
