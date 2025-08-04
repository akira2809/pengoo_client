# Hướng dẫn sử dụng Cypress

## Cài đặt

```bash
npm install cypress --save-dev
```

## Cấu trúc thư mục

- `cypress/e2e/`: Chứa các file test
- `cypress/support/`: Chứa các file hỗ trợ
- `cypress/fixtures/`: Chứa dữ liệu test
- `cypress.config.ts`: File cấu hình chính của Cypress

## Chạy test

1. Chạy ứng dụng Next.js:
   ```bash
   npm run dev
   ```

2. Mở Cypress Test Runner:
   ```bash
   npx cypress open
   ```

3. Hoặc chạy test trong terminal:
   ```bash
   npx cypress run
   ```

## Viết test mới

1. Tạo file mới trong thư mục `cypress/e2e/` với đuôi `.cy.ts`
2. Sử dụng các cú pháp của Cypress để viết test

## Ví dụ test cơ bản

```typescript
describe('Tên test suite', () => {
  it('mô tả test case', () => {
    cy.visit('/');
    // Các lệnh test
  });
});
```

## Tài liệu tham khảo

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
