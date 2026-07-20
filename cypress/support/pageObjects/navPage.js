export default class NavPage {
    constructor() {
        this.cadastroProdutoButton = '[data-testid="cadastrar-produtos"]';
        this.listaProdutosButton = '[data-testid="listar-produtos"]';
        this.logoutButton = '[data-testid="logout"]';
        this.cadastroUsuarioButton = '[data-testid="cadastrar-usuarios"]';
        this.message = '[role="alert"]';
    }

    accessCadastroProdutosPage() {
        cy.get(this.cadastroProdutoButton).click();
    }

    accessListaProdutosPage() {
        cy.get(this.listaProdutosButton).click();
    }

    accessCadastroUsuarioPage() {
        cy.get(this.cadastroUsuarioButton).click();
    }

    verifyIsLoggedIn() {
        cy.get(this.logoutButton).should('be.visible');
    }

    logout() {
        cy.get(this.logoutButton).click();
        cy.url().should('contain', '/login');
    }

    verifyMandatoryFieldMessage(field) {
        cy.get(this.message).should('be.visible')
            .and('contain.text', `${field} é obrigatório`);
    }

    verifyMessage(message) {
        cy.get(this.message).should('be.visible')
            .and('contain.text', message);
    }
}