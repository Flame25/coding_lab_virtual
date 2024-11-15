import { exec } from "child_process";

export default async function handler(req, res) {
  let body = "";

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
    const num = parsedBody.num;

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
        res.end(`Compilation Error`);
      } else {
        // If compilation is successful, run the code

        if (lang == "cpp" || lang == "c") {
          // Start checking answer no 1 (idk how to automatically check based on number)
          // Just 1 test case per number
          if (num == 1) {
            exec("./output", (runErr, runStdout, runStderr) => {
              if (runErr) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(`Runtime Error`);
              }
              exec(
                "./checker/a" + num,
                (secondErr, secondStdout, secondStderr) => {
                  if (secondStdout == runStdout) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(`Success`);
                  } else {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(`Wrong`);
                  }
                },
              );
            });
          } else if (num == 2) {
            const child = spawn("./output");

            const anotherChild = spawn("./checker/a2");

            let ot1 = "";
            let ot2 = "";

            // Send input to the program (e.g., entering a number)
            child.stdin.write("6\n"); // This simulates typing '42' into scanf
            child.stdin.end(); // End the input stream after sending the data

            // Capture stdout (output from `print`)
            child.stdout.on("data", (data) => {
              console.log(`Output: ${data.toString()}`);
              ot1 += data.toString();
            });

            console.log(ot1);

            // Capture stderr (errors)
            child.stderr.on("data", (data) => {
              console.error(`Error: ${data.toString()}`);
            });

            // Send input to the program (e.g., entering a number)
            anotherChild.stdin.write("6\n"); // This simulates typing '42' into scanf
            anotherChild.stdin.end(); // End the input stream after sending the data

            // Capture stdout (output from `print`)
            anotherChild.stdout.on("data", (data) => {
              console.log(`Output: ${data.toString()}`);
              ot2 += data.toString();
            });

            // Capture stderr (errors)
            anotherChild.stderr.on("data", (data) => {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end(`Runtime Error`);
            });

            // Handle process exit

            anotherChild.on("close", (code) => {
              console.log(`Process exited with code ${code}`);
              console.log(`Out : ${ot1}`);
              // Handle process exit
              child.on("close", (code) => {
                console.log(`Process exited with code ${code}`);
                console.log(`Out : ${ot2}`);

                if (ot1 == ot2) {
                  res.writeHead(200, { "Content-Type": "text/plain" });
                  res.end(`Success`);
                } else {
                  res.writeHead(200, { "Content-Type": "text/plain" });
                  res.end(`Wrong`);
                }
              });
            });
          } else if (num == 3) {
            const child = spawn("./output");

            const anotherChild = spawn("./checker/a3");

            let ot1 = "";
            let ot2 = "";

            // Send input to the program (e.g., entering a number)
            child.stdin.write("6\n"); // This simulates typing '42' into scanf
            child.stdin.end(); // End the input stream after sending the data

            // Capture stdout (output from `print`)
            child.stdout.on("data", (data) => {
              console.log(`Output: ${data.toString()}`);
              ot1 += data.toString();
            });

            // Capture stderr (errors)
            child.stderr.on("data", (data) => {
              console.error(`Error: ${data.toString()}`);
            });

            // Send input to the program (e.g., entering a number)
            anotherChild.stdin.write("6\n"); // This simulates typing '42' into scanf
            anotherChild.stdin.end(); // End the input stream after sending the data

            // Capture stdout (output from `print`)
            anotherChild.stdout.on("data", (data) => {
              console.log(`Output: ${data.toString()}`);
              ot2 += data.toString();
            });

            // Capture stderr (errors)
            anotherChild.stderr.on("data", (data) => {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end(`Runtime Error`);
            });

            // Handle process exit

            anotherChild.on("close", (code) => {
              console.log(`Process exited with code ${code}`);
              console.log(`Out : ${ot1}`);
              // Handle process exit
              child.on("close", (code) => {
                console.log(`Process exited with code ${code}`);
                console.log(`Out : ${ot2}`);

                if (ot1 == ot2) {
                  res.writeHead(200, { "Content-Type": "text/plain" });
                  res.end(`Success`);
                } else {
                  res.writeHead(200, { "Content-Type": "text/plain" });
                  res.end(`Wrong`);
                }
              });
            });
          }
        } else if (lang == "python") {
          const result = stdout.trim(); // Trim any extra whitespace or newlines
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(result);
        }
      }
    });
  });
}
