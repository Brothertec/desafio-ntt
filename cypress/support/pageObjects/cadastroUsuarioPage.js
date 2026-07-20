import NavPage from './navPage';

export default class CadastroUsuarioPage extends NavPage {
    constructor() {
        super();
        this.nomeInput = '[data-testid="nome"]';
        this.emailInput = '[data-testid="email"]';
        this.passwordInput = '[data-testid="password"]';
        this.cadastrarButton = '[data-testid="cadastrarUsuario"]';
    }

    fillUsuarioForm(nome, email, password) {
        cy.get(this.nomeInput).type(nome);
        cy.get(this.emailInput).type(email);
        cy.get(this.passwordInput).type(password);
    }

    clickCadastrarButton() {
        cy.get(this.cadastrarButton).click();
    }
}