// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { faker } from '@faker-js/faker';

Cypress.Commands.add('criaApiAdminUserELoga', () => {
    cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/login`,
        body: {
            email: 'automation@serverest.dev',
            password: 'teste'
        },
        failOnStatusCode: false,
    }).then((response) => {
        if (response.status === 200) {
            expect(response.body.authorization).to.be.not.empty;
            Cypress.expose('adminToken', response.body.authorization);
        } else {
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/usuarios`,
                body: {
                    nome: 'Automation',
                    email: 'automation@serverest.dev',
                    password: 'teste',
                    administrador: 'true',
                },
            }).then((response) => {
                Cypress.expose('userId', response.body._id);
                cy.request({
                    method: 'POST',
                    url: `${Cypress.expose('apiUrl')}/login`,
                    body: {
                        email: 'automation@serverest.dev',
                        password: 'teste'
                    },
                }).then((response) => {
                    expect(response.body.authorization).to.be.not.empty;
                    Cypress.expose('adminToken', response.body.authorization);
                });
            });
        }
    })
})

Cypress.Commands.add('criaUsuarioRandomicoELoga', () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/usuarios`,
        body: {
            nome: faker.person.fullName(),
            email: email,
            password: password,
            administrador: 'false',
        },
    }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        Cypress.expose('userId', response.body._id);
        cy.request({
            method: 'POST',
            url: `${Cypress.expose('apiUrl')}/login`,
            body: {
                email: email,
                password: password,
            },
        }).then((response) => {
            Cypress.expose('userToken', response.body.authorization);
        });
    })
})

Cypress.Commands.add('criaProdutoRandomico', () => {
    const quantity = faker.number.int({ min: 10, max: 20 });
    cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/produtos`,
        headers: {
            Authorization: `${Cypress.expose('adminToken')}`,
        },
        body: {
            nome: faker.commerce.productName(),
            preco: faker.number.int({ min: 10, max: 100 }),
            descricao: faker.commerce.productDescription(),
            quantidade: quantity,
        }
    }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        Cypress.expose('productId', response.body._id);
        Cypress.expose('productQuantity', quantity);
    })
})

Cypress.Commands.add('criaCarrinho', () => {
    cy.request({
        method: 'POST',
        url: `${Cypress.expose('apiUrl')}/carrinhos`,
        headers: {
            Authorization: `${Cypress.expose('userToken')}`,
        },
        body: {
            produtos: [
                {
                    idProduto: Cypress.expose('productId'),
                    quantidade: 1,
                }
            ]
        }
    }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        Cypress.expose('cartId', response.body._id);
    })
})

Cypress.Commands.add('verificaQueCarrinhoFoiCriado', () => {
    cy.log(Cypress.expose('userId'));
    cy.request({
        method: 'GET',
        url: `${Cypress.expose('apiUrl')}/carrinhos`,
        qs: {
            idUsuario: Cypress.expose('userId'),
        },
        headers: {
            Authorization: `${Cypress.expose('userToken')}`,
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.be.eq(1);
        expect(response.body.carrinhos[0].produtos[0].idProduto).to.eq(Cypress.expose('productId'));
    })
})

Cypress.Commands.add('verificaQueOEstoqueFoiAtualizado', () => {
    cy.request({
        method: 'GET',
        url: `${Cypress.expose('apiUrl')}/produtos/${Cypress.expose('productId')}`,
        headers: {
            Authorization: `${Cypress.expose('adminToken')}`,
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.be.eq(Cypress.expose('productQuantity') - 1);
    })
})

Cypress.Commands.add('deletaProduto', ( type ) => {
    const auth = type === "admin" ? Cypress.expose('adminToken') : Cypress.expose('userToken');
    const product = Cypress.expose('productId');
    cy.request({
        method: 'DELETE',
        url: `${Cypress.expose('apiUrl')}/produtos/${product}`,
        headers: {
            Authorization: `${auth}`,
        },
        failOnStatusCode: false,
    }).as('deleteProduct')
})

Cypress.Commands.add('verificaQueProdutoNaoPodeSerDeletado', ( status, message ) => {
    cy.get('@deleteProduct').then((response) => {
        expect(response.status).to.eq(status);
        expect(response.body.message).to.eq(message);
    })
})