// server.js
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/compile", (req, res) => {
  // Collect the code and language from the request body
  const { code, lang } = req.body;

  if (!code || !lang) {
    return res.status(400).json({ error: "Missing code or language" });
  }

  let compileCommand = "";
  let fileName = "";

  if (lang === "cpp") {
    fileName = "code.cpp";
    compileCommand = `g++ ${fileName} -o output`;
  } else if (lang === "c") {
    fileName = "code.c";
    compileCommand = `gcc ${fileName} -o output`;
  } else if (lang === "python") {
    fileName = "code.py";
    compileCommand = `python3 ${fileName}`;
  } else {
    return res.status(400).json({ error: "Unsupported language" });
  }

  // Write the code to a temporary file in memory or use a temporary file system
  try {
    fs.writeFileSync(fileName, code);

    // Compile the code
    exec(compileCommand, (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: `Compilation Error: ${stderr}` });
      }

      // If compilation is successful, run the code
      if (lang === "cpp" || lang === "c") {
        exec("./output", (runErr, runStdout, runStderr) => {
          if (runErr) {
            return res
              .status(500)
              .json({ error: `Runtime Error: ${runStderr}` });
          }
          return res.status(200).json({ output: runStdout });
        });
      } else if (lang === "python") {
        // For Python, just return the result of the execution
        const result = stdout.trim();
        return res.status(200).json({ output: result });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error writing file: ${error.message}` });
  }
});

app.post("/send", (req, res) => {
  const { data } = req.body;
  console.log("Received data:", data);

  // Respond with some message
  res.status(200).json({ message: "Data received", data });
});

// Vercel expects us to export the handler for serverless functions
module.exports = app;
