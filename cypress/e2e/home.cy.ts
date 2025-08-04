describe('Trang chủ PENGOO', () => {
  beforeEach(() => {
    // Truy cập trang chủ trước mỗi test
    cy.visit('/');
  });

  it('hiển thị đúng tiêu đề trang', () => {
    // Kiểm tra tiêu đề trang
    cy.title().should('include', 'PENGOO - Board Game');
  });

  it('hiển thị các phần chính của trang', () => {
    // Kiểm tra header
    cy.get('header').should('be.visible');
    
    // Kiểm tra banner chính
    cy.get('[data-cy="main-banner"]').should('be.visible');
    
    // Kiểm tra danh sách sản phẩm
    cy.get('[data-cy="product-list"]').should('be.visible');
    
    // Kiểm tra footer
    cy.get('footer').should('be.visible');
  });

  it('cho phép tìm kiếm sản phẩm', () => {
    // Tìm kiếm sản phẩm
    cy.get('[data-cy="search-input"]')
      .type('board game')
      .should('have.value', 'board game');
      
    // Nhấn nút tìm kiếm
    cy.get('[data-cy="search-button"]').click();
    
    // Kiểm tra URL sau khi tìm kiếm
    cy.url().should('include', '/search?q=board+game');
  });

  it('cho phép điều hướng đến trang sản phẩm', () => {
    // Nhấp vào sản phẩm đầu tiên
    cy.get('[data-cy="product-item"]').first().click();
    
    // Kiểm tra đã chuyển đến trang chi tiết sản phẩm
    cy.url().should('match', /\/products\//);
    cy.get('[data-cy="product-detail"]').should('be.visible');
  });
});
