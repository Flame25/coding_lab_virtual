import { exec } from "child_process";

export default async function handler(req, res) {
  // Only handle POST requests
  if (req.method === "POST") {
    const { code, lang } = req.body;

    // Validate that both code and lang are provided
    if (!code || !lang) {
      return res.status(400).json({ error: "Missing code or language" });
    }

    let compileCommand = "";
    let fileName = "";

    // Set up the file name and compile command based on the language
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

    // Temporarily write the code to a file (use an in-memory solution if possible)
    try {
      // For Vercel, you may want to skip writing to a file and execute directly in memory,
      // but for simplicity, we'll simulate writing the code to a file here.
      const fs = require("fs");
      fs.writeFileSync(fileName, code);

      // Compile the code
      exec(compileCommand, (err, stdout, stderr) => {
        if (err) {
          return res
            .status(500)
            .json({ error: `Compilation Error: ${stderr}` });
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
          const result = stdout.trim();
          return res.status(200).json({ output: result });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error writing file: ${error.message}` });
    }
  } else {
    // If the method is not POST, return 405 (Method Not Allowed)
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
