describe('Testes End to End', () => {

    before(() => {
        cy.criaAdminUserELoga();
        cy.criaUsuarioRandomicoELoga();
    })

    it('E2E-CT001 - Verifica criação de lista de produtos', () => {
        cy.visit('/login');
        cy.get('[data-testid="email"]').type('automation@serverest.dev');
        cy.get('[data-testid="senha"]').type('teste');
        cy.get('[data-testid="entrar"]').click();
        cy.get('[data-testid="logout"]').should('be.visible');
        cy.get('[data-testid="cadastrar-produtos"]').click();
        cy.get('[data-testid="nome"]').type('Produto de Teste');
        cy.get('[data-testid="preco"]').type('100');
        cy.get('[data-testid="descricao"]').type('Descrição do Produto de Teste');
        cy.get('[data-testid="quantity"]').type('10');
        cy.get('[data-testid="cadastarProdutos"]').click();
        cy.url().should('contain', '/admin/listarprodutos');
        cy.contains('Produto de Teste').should('be.visible');
    })
})