// Simple app file that references process.env to simulate a secret usage
if (process.env.OPENAI_API_KEY) {
  console.log('has key');
}

// mention openai in code to detect provider
// using the token name OPENAI_API_KEY
const client = 'openai';
console.log('client:', client);
