const { exec } = require("child_process");
const port = process.argv[2] || 5002;

console.log(`🔍 Looking for process on port ${port}...`);

if (process.platform === "win32") {
  exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
    if (stdout) {
      const pid = stdout.split(/\s+/).pop();
      console.log(`📌 Found PID: ${pid}`);
      exec(`taskkill /F /PID ${pid}`, (err) => {
        if (!err) console.log(`✅ Killed process on port ${port}`);
      });
    } else {
      console.log(`✅ No process found on port ${port}`);
    }
  });
}
