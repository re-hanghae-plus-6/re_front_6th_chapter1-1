import '@testing-library/jest-dom';
import { configure } from '@testing-library/dom';
import { afterAll, beforeAll } from 'vitest';
import { server } from './__tests__/mockServerHandler.js';

// jsdom 환경에서 IntersectionObserver 없어 테스트용 mock을 전역에 정의
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

configure({
  asyncUtilTimeout: 1000,
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});
