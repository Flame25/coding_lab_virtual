export async function executeProgram(command, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command);

    let output = "";
    let error = "";

    // Write input to the program
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    // Capture output
    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Capture errors
    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    // Handle process exit
    child.on("close", (code) => {
      if (code !== 0) {
        reject(`Error: ${error}`);
      } else {
        resolve(output.trim());
      }
    });
  });
}
