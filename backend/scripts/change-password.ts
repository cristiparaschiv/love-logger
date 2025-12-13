import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function changePassword(username: string, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { username },
      data: { passwordHash },
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('\n🔐 Love Logger - Password Change Utility\n');

  // Check command line arguments
  const args = process.argv.slice(2);

  if (args.length >= 2) {
    // Non-interactive mode: change-password.ts <username> <password>
    const [username, password] = args;

    if (!['he', 'she'].includes(username)) {
      console.error('❌ Invalid username. Must be "he" or "she"');
      process.exit(1);
    }

    if (password.length < 4) {
      console.error('❌ Password must be at least 4 characters');
      process.exit(1);
    }

    const success = await changePassword(username, password);
    if (success) {
      console.log(`✅ Password changed successfully for "${username}"`);
    } else {
      console.error(`❌ Failed to change password for "${username}"`);
      process.exit(1);
    }
  } else {
    // Interactive mode
    console.log('Which user password do you want to change?');
    console.log('  1. he');
    console.log('  2. she');
    console.log('  3. both\n');

    const choice = await question('Enter choice (1/2/3): ');

    const users: string[] = [];
    if (choice === '1') users.push('he');
    else if (choice === '2') users.push('she');
    else if (choice === '3') users.push('he', 'she');
    else {
      console.error('❌ Invalid choice');
      rl.close();
      process.exit(1);
    }

    for (const username of users) {
      console.log(`\nChanging password for "${username}":`);

      const password = await question('  Enter new password (min 4 chars): ');

      if (password.length < 4) {
        console.error('  ❌ Password too short, skipping...');
        continue;
      }

      const confirm = await question('  Confirm password: ');

      if (password !== confirm) {
        console.error('  ❌ Passwords do not match, skipping...');
        continue;
      }

      const success = await changePassword(username, password);
      if (success) {
        console.log(`  ✅ Password changed successfully for "${username}"`);
      } else {
        console.error(`  ❌ Failed to change password for "${username}"`);
      }
    }
  }

  rl.close();
  await prisma.$disconnect();
  console.log('\nDone!\n');
}

main().catch((e) => {
  console.error('Error:', e);
  rl.close();
  process.exit(1);
});
