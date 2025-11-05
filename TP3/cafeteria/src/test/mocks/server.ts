import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Crea un servidor de mocks con los handlers definidos
export const server = setupServer(...handlers);