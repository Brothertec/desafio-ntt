describe('Testes de API', () => {
  it('API-CT001 - Verifica que o estoque foi atualizado ao adicionar um produto ao carrinho', () => {
    cy.criaApiAdminUserELoga();
    cy.criaUsuarioRandomicoELoga();
    cy.criaProdutoRandomico();
    cy.criaCarrinho();
    cy.verificaQueCarrinhoFoiCriado();
    cy.verificaQueOEstoqueFoiAtualizado();
  })
  
  it('API-CT002 - Verifica que o produto em um carrinho não pode ser deletado', () => {
    cy.criaApiAdminUserELoga();
    cy.criaUsuarioRandomicoELoga();
    cy.criaProdutoRandomico();
    cy.criaCarrinho();
    cy.verificaQueCarrinhoFoiCriado();
    cy.deletaProduto();
    cy.verificaQueProdutoNaoPodeSerDeletado();
  })
})
