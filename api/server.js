// server.js

const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example POST routes
app.post("/compile", (req, res) => {
  // Collect the POST data
  req.on("data", (chunk) => {
    body += chunk;
  });

  // Once the full body is received, process the code
  req.on("end", () => {
    // Parse the code from the form data
    const parsedBody = querystring.parse(body);
    const code = parsedBody.code;
    const lang = parsedBody.lang;

    let compileCommand = "";
    // Save the code to a file (for example, `code.c` or `code.cpp`)
    let fileName = "";
    if (lang == "cpp") {
      fileName = "code.cpp";
      compileCommand = `g++ ${fileName} -o output`;
    } else if (lang == "c") {
      fileName = "code.c";
      compileCommand = `gcc ${fileName} -o output`;
    } else if (lang == "python") {
      fileName = "code.py";
      compileCommand = `python3 ${fileName}`;
    }

    fs.writeFileSync(fileName, code);

    // Compile the code
    exec(compileCommand, (err, stdout, stderr) => {
      if (err) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Compilation Error:\n${stderr}`);
      } else {
        // If compilation is successful, run the code

        if (lang == "cpp" || lang == "c") {
          exec("./output", (runErr, runStdout, runStderr) => {
            if (runErr) {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end(`Runtime Error:\n${runStderr}`);
            } else {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end(`${runStdout}`);
            }
          });
        } else if (lang == "python") {
          const result = stdout.trim(); // Trim any extra whitespace or newlines
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(result);
        }
      }
    });
  });

  // Respond with some message
  res.status(200).json({ message: "Code compiled", code, lang });
});

app.post("/send", (req, res) => {
  const { data } = req.body;
  console.log("Received data:", data);

  // Respond with some message
  res.status(200).json({ message: "Data received", data });
});

// Vercel expects us to export the handler for serverless functions
module.exports = app;
