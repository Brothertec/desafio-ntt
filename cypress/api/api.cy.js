import { faker } from '@faker-js/faker';

describe('Carrinho API', () => {
    it('API-CT001 - Deve criar um carrinho', () => {
        //cria usuario administrador da automacao caso nao exista
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
                Cypress.expose('token', response.body.authorization);
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
                        Cypress.expose('token', response.body.authorization);
                    });
                });
            }
        }).then(() => {

            //cria usuario para adicionar o carrinho
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/usuarios`,
                body: {
                    nome: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    administrador: 'false',
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
                Cypress.expose('userId', response.body._id);
            });

            //cria produto para adicionar ao carrinho
            cy.log(Cypress.expose('token'));
            cy.request({
                method: 'POST',
                url: `${Cypress.expose('apiUrl')}/produtos`,
                headers: {
                    Authorization: `${Cypress.expose('token')}`,
                },
                body: {
                    nome: faker.commerce.productName(),
                    preco: faker.number.int({ min: 10, max: 100 }),
                    descricao: faker.commerce.productDescription(),
                    quantidade: faker.number.int({ min: 10, max: 20 }),
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
                Cypress.expose('productId', response.body._id);
                Cypress.expose('productQuantity', response.body.quantidade);
            }).then(() => {
                cy.pause();
                //cadastra o carrinho
                cy.request({
                    method: 'POST',
                    url: `${Cypress.expose('apiUrl')}/carrinhos`,
                    headers: {
                        Authorization: `${Cypress.expose('token')}`,
                    },
                    body: {
                        produtos: [
                            {
                                idProduto: Cypress.expose('productId'),
                                quantidade: 1,
                            }
                        ]
                    }
                })
            })

            //verifica se o carrinho foi criado
            cy.request({
                method: 'GET',
                url: `${Cypress.expose('apiUrl')}/carrinhos`,
                query: {
                    usuarioId: Cypress.expose('userId'),
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.produtos).to.have.length(1);
                expect(response.body.produtos[0].id).to.eq(Cypress.expose('productId'));
                expect(response.body.produtos[0].quantidade).to.eq(1);
            });
        })
    })
});
