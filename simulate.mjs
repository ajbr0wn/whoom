import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
globalThis.localStorage = { getItem: () => null, setItem: () => {} };


async function main() {
  const api = await import('./frontend/src/services/api.js');
  const rl = readline.createInterface({ input, output });

  let messages = [];
  while (true) {
    const user = await rl.question('You: ');
    if (!user.trim()) break;
    messages.push({ role: 'user', content: user });
    const { response } = await api.generateResponse(messages);
    console.log('Assistant:', response);
    const analysis = await api.analyzeResponse(response);
    console.log('Characters:', analysis.characters.map(c => c.name).join(', '));
    messages.push({ role: 'assistant', content: response });
  }
  rl.close();
}

main();
