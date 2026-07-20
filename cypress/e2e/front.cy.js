import LoginPage from '../support/pageObjects/loginPage';
import NavPage from '../support/pageObjects/navPage';
import CadastroProdutosPage from '../support/pageObjects/cadastroProdutosPage';
import CadastroUsuarioPage from '../support/pageObjects/cadastroUsuarioPage';
import ListarProdutosPage from '../support/pageObjects/listarProdutosPage';
import HomePage from '../support/pageObjects/homePage';
import MinhaListaProdutos from '../support/pageObjects/minhaListaProdutos';

const loginPage = new LoginPage();
const navPage = new NavPage();
const homePage = new HomePage();
const cadastroProdutosPage = new CadastroProdutosPage();
const cadastroUsuarioPage = new CadastroUsuarioPage();
const listarProdutosPage = new ListarProdutosPage();
const minhaListaProdutos = new MinhaListaProdutos();

describe('Testes End to End', () => {
  before(() => {
    cy.criaAdminUserELoga();
    cy.criaUsuarioRandomicoELoga();
  });

  afterEach(() => {
    cy.deletaProdutoPorNome(Cypress.expose('productName'));
  });

  after(() => {
    cy.deletaUsuarioRandomico();
  });

  it('E2E-CT001 - Verifica que o cliente pode limpar lista de produtos', () => {
    loginPage.visit();
    loginPage.login(Cypress.expose('adminEmail'), Cypress.expose('adminPassword'));
    navPage.verifyIsLoggedIn();
    navPage.accessCadastroProdutosPage();
    cadastroProdutosPage.fillProdutoForm();
    cadastroProdutosPage.clickCadastrarButton();
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
  });

  it('E2E-CT002 - Verifica campos obrigatórios ao cadastrar usuário', () => {
    loginPage.visit();
    loginPage.login(Cypress.expose('adminEmail'), Cypress.expose('adminPassword'));
    navPage.verifyIsLoggedIn();
    navPage.accessCadastroUsuarioPage();
    cadastroUsuarioPage.clickCadastrarButton();
    cadastroUsuarioPage.verifyMandatoryFieldMessage('Nome');
    cadastroUsuarioPage.verifyMandatoryFieldMessage('Email');
    cadastroUsuarioPage.verifyMandatoryFieldMessage('Password');
  });

  it('E2E-CT003 - Verifica que o preço do produto deve ser maior que 0', () => {
    loginPage.visit();
    loginPage.login(Cypress.expose('adminEmail'), Cypress.expose('adminPassword'));
    navPage.verifyIsLoggedIn();
    navPage.accessCadastroProdutosPage();
    cadastroProdutosPage.fillProdutoForm(undefined, 0);
    cadastroProdutosPage.clickCadastrarButton();
    cadastroProdutosPage.verifyMessage('Preco deve ser um número positivo');
    cadastroProdutosPage.fillProdutoForm(undefined, -1);
    cadastroProdutosPage.clickCadastrarButton();
    cadastroProdutosPage.verifyMessage('Preco deve ser um número positivo');
  });
});
