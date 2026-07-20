import LoginPage from '../support/pageObjects/loginPage';
import NavPage from '../support/pageObjects/navPage';
import CadastrarProdutosPage from '../support/pageObjects/cadastrarProdutosPage';
import ListarProdutosPage from '../support/pageObjects/listarProdutosPage';
import HomePage from '../support/pageObjects/homePage';
import MinhaListaProdutos from '../support/pageObjects/minhaListaProdutos';

const loginPage = new LoginPage();
const navPage = new NavPage();
const cadastrarProdutosPage = new CadastrarProdutosPage();
const listarProdutosPage = new ListarProdutosPage();
const homePage = new HomePage();
const minhaListaProdutos = new MinhaListaProdutos();

describe('Testes End to End', () => {
    before(() => {
        cy.criaAdminUserELoga();
        cy.criaUsuarioRandomicoELoga();
    })

    afterEach(() => {
        cy.deletaProdutoPorNome(Cypress.expose('productName'));
    })

    after(() => {
        cy.deletaUsuarioRandomico();
    })

    it('E2E-CT001 - Verifica que o cliente pode limpar lista de produtos', () => {
        loginPage.visit();
        loginPage.login(Cypress.expose('adminEmail'), Cypress.expose('adminPassword'));
        navPage.verifyIsLoggedIn();
        navPage.accessCadastroProdutosPage();
        cadastrarProdutosPage.fillProdutoForm();
        cadastrarProdutosPage.clickCadastrarButton();
        listarProdutosPage.verifyIsOnPage();
        listarProdutosPage.verifyProdutoCreated(
            Cypress.expose('productName'),
            Cypress.expose('productPrice'),
            Cypress.expose('productDescription'),
            Cypress.expose('productQuantity'),
            Cypress.expose('productImage')
        );
        listarProdutosPage.logout();
        loginPage.login(Cypress.expose('userEmail'), Cypress.expose('userPassword'));
        homePage.verifyIsOnPage();
        homePage.searchForProduct(Cypress.expose('productName'));
        homePage.addProductToClientList();
        minhaListaProdutos.verifyIsOnPage();
        minhaListaProdutos.verifyProductAdded(Cypress.expose('productName'));
        minhaListaProdutos.clearList();
        minhaListaProdutos.verifyEmptyList();
    })
})