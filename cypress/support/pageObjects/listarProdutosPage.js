import NavPage from './navPage';

export default class ListarProdutosPage extends NavPage {
    constructor() {
        super();
        this.produtosTable = 'table tr';
        this.defaultImagePrefix = 'C:\\fakepath\\';
    }

    verifyIsOnPage() {
        cy.url().should('contain', '/admin/listarprodutos');
    }

    verifyProdutoCreated( nome, preco, descricao, quantidade, imagem ) {
        const linhaProduto = cy.get(this.produtosTable).contains(nome).parent('tr');
        linhaProduto.within(() => {
            cy.get('td').eq(0).should('have.text', nome);
            cy.get('td').eq(1).should('have.text', preco);
            cy.get('td').eq(2).should('have.text', descricao);
            cy.get('td').eq(3).should('have.text', quantidade);
            cy.get('td').eq(4).should('have.text', this.defaultImagePrefix + imagem.split('/').pop());
        });
    }

    verifyProdutoDeleted( nome ) {
        cy.get(this.produtosTable).should('not.contain', nome);
    }

    clickEditarButton( nome ) {
        const linhaProduto = cy.get(this.produtosTable).contains(nome).parent('tr');
        linhaProduto.within(() => {
            cy.get('button').contains('Editar').click();
        });
    }

    clickExcluirButton( nome ) {
        const linhaProduto = cy.get(this.produtosTable).contains(nome).parent('tr');
        linhaProduto.within(() => {
            cy.get('button').contains('Excluir').click();
        });
    }
}