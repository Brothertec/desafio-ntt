import NavPage from './navPage';

export default class HomePage extends NavPage {
    constructor() {
        super();
        this.appTitle = 'h1';
        this.searchInput = '[data-testid="pesquisar"]';
        this.searchButton = '[data-testid="botaoPesquisar"]';
        this.addProductButton = '[data-testid="adicionarNaLista"]';
    }

    verifyIsOnPage() {
        cy.get(this.appTitle).should('have.text', 'Serverest Store')
            .and('be.visible');
    }

    searchForProduct(productName) {
        cy.get(this.searchInput).type(productName);
        cy.get(this.searchButton).click();
    }

    addProductToClientList() {
        cy.get(this.addProductButton).click();
    }
}