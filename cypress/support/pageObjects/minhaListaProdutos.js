import NavPage from './navPage';

export default class MinhaListaProdutos extends NavPage {

    constructor() {
        super();
        this.productName = '[data-testid="shopping-cart-product-name"]';
        this.clearListButton = '[data-testid="limparLista"]';
        this.emptyListMessage = '[data-testid="shopping-cart-empty-message"]';
    }

    verifyIsOnPage() {
        cy.url().should('contain', '/minhaListaDeProdutos');
    }

    verifyProductAdded(product) {
        cy.get(this.productName).should('contain.text', product)
            .and('be.visible');
    }

    clearList() {
        cy.get(this.clearListButton).click();
    }

    verifyEmptyList() {
        cy.get(this.emptyListMessage).should('be.visible')
            .and('contain.text', 'Seu carrinho está vazio');
    }
}