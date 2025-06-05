import * as simulated from './api';
import * as llm from './llmApi';

let provider = localStorage.getItem('provider') || 'simulated';

simulated.setProvider(provider);
llm.setProvider(provider);

export const setProvider = (p) => {
  provider = p;
  simulated.setProvider(p);
  llm.setProvider(p);
};

export const setApiKey = (key, p = provider) => {
  simulated.setApiKey(key, p);
  llm.setApiKey(key, p);
};

export const generateResponse = async (messages) => {
  if (provider === 'simulated') {
    return simulated.generateResponse(messages);
  }
  return llm.generateResponse(messages);
};

export const analyzeResponse = async (responseText, prevCharacters = []) => {
  if (provider === 'simulated') {
    return simulated.analyzeResponse(responseText, prevCharacters);
  }
  return llm.analyzeResponse(responseText, prevCharacters);
};

const services = {
  setProvider,
  setApiKey,
  generateResponse,
  analyzeResponse,
};

export default services;
