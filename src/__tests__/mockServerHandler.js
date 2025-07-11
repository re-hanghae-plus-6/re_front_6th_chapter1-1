// 기본 상품 데이터
import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers.js";

// MSW 서버 설정
export const server = setupServer(...handlers);