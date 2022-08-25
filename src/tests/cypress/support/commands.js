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

import {faker} from "@faker-js/faker";

Cypress.Commands.add('createAccount', (name, email, password) => {
    const body = {
        name: name != undefined ? name : faker.name.fullName(),
        email: email != undefined ? email.toLowerCase() : faker.internet.email().toLowerCase(),
        password: password != undefined ? password : faker.internet.password(20, true)
    }
    cy.request({
        method: 'POST',
        url: '/auth/register',
        body: body,
        failOnStatusCode: false
    }).then((xhr) => {
        expect(xhr.status).to.eq(200)
        expect(xhr.body).to.have.property('token')
        expect(xhr.body).to.have.property('user')
        expect(xhr.body.user).to.have.property('email')
        expect(xhr.body.user).to.have.property('name')
        expect(xhr.body.token).to.not.be.empty
        expect(xhr.body.user.name).to.not.be.empty
        expect(xhr.body.user.email).to.not.be.empty
        expect(xhr.body.user.createdAt).to.not.be.empty
    })
})