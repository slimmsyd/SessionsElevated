#!/usr/bin/env node
import { scrypt as scryptCb, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import readline from "node:readline";

const scrypt = promisify(scryptCb);

function readSilent(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    process.stdout.write(prompt);
    rl.input.on("data", () => {
      // Mute echo by overwriting
      readline.moveCursor(process.stdout, -1, 0);
      readline.clearLine(process.stdout, 1);
    });
    rl.question("", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const arg = process.argv[2];
  let password = arg;
  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    password = await new Promise((resolve) =>
      rl.question("Enter admin password: ", (a) => {
        rl.close();
        resolve(a);
      }),
    );
  }
  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  const hash = `${salt.toString("hex")}:${derived.toString("hex")}`;
  const sessionSecret = randomBytes(48).toString("hex");

  console.log("\nAdd these to .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
