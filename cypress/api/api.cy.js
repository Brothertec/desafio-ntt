describe('Testes de API', () => {
  before(() => {
    cy.criaAdminUserELoga();
    cy.criaUsuarioRandomicoELoga();
    cy.criaProdutoRandomico();
  })

  afterEach(() => {
    cy.deletaCarrinho();
  })

  after(() => {
    cy.deletaProduto("admin");
    cy.deletaUsuarioRandomico();
  })

  it('API-CT001 - Verifica que o estoque foi atualizado ao adicionar um produto ao carrinho', () => {
    cy.criaCarrinho();
    cy.verificaQueCarrinhoFoiCriado();
    cy.verificaQueOEstoqueFoiAtualizado();
  })

  it('API-CT002 - Verifica que o produto em um carrinho não pode ser deletado', () => {
    cy.criaCarrinho();
    cy.verificaQueCarrinhoFoiCriado();
    cy.deletaProduto("admin");
    cy.verificaQueProdutoNaoPodeSerDeletado(400, 'Não é permitido excluir produto que faz parte de carrinho');
  })

  it('API-CT003 - Verifica que usuários não administradores não podem deletar produtos', () => {
    cy.deletaProduto("user");
    cy.verificaQueProdutoNaoPodeSerDeletado(403, 'Rota exclusiva para administradores');
  })
})
