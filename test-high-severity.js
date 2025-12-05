// This file is intentionally terrible to trigger HIGH severity

// SQL Injection vulnerability
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return database.query(query);
}

// eval() - opening the gates of hell
function executeUserCode(userInput) {
  eval(userInput);
}

// XSS vulnerability
function displayUserComment(comment) {
  document.innerHTML = comment;
}

// Hardcoded credentials
const API_KEY = "sk-1234567890abcdef";
const PASSWORD = "admin123";
const SECRET_TOKEN = "super_secret_token_12345";

// React hooks in a loop
function BadComponent() {
  for (let i = 0; i < 10; i++) {
    const [state, setState] = useState(i);
  }

  if (Math.random() > 0.5) {
    useEffect(() => {
      console.log("This is wrong");
    });
  }
}

// Infinite loop
function processData() {
  while (true) {
    console.log("Never ending");
  }
}

// No error handling with sensitive operations
async function deleteAllUsers() {
  await fetch('/api/users/delete-all');
}

// Prototype pollution
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
}

// Command injection
const exec = require('child_process').exec;
function runCommand(userInput) {
  exec('ls ' + userInput);
}

// Insecure random
function generateToken() {
  return Math.random().toString(36);
}

// No input validation
function transferMoney(amount, toAccount) {
  bank.transfer(amount, toAccount);
}
