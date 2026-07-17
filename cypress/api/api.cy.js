describe('Testes de API', () => {
  it('API-CT001 - Verifica que o estoque foi atualizado ao adicionar um produto ao carrinho', () => {
    cy.criaApiAdminUserELoga();
    cy.criaUsuarioRandomicoELoga();
    cy.criaProdutoRandomico();
    cy.criaCarrinho();
    cy.verificaQueCarrinhoFoiCriado();
    cy.verificaQueOEstoqueFoiAtualizado();
  })
})
