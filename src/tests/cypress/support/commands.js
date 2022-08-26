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

const authConfig = require("../../../config/auth.json");

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

Cypress.Commands.add('getForgotAccountMessage', (email) => {
    const BASE_URL = 'https://mailtrap.io/'
    let emailMessage = {}
    cy.request({
        method: 'GET',
        url: `${BASE_URL}/api/accounts`,
        headers: {
            "Api-Token": authConfig.mailtrapApiToken
        }
    }).then(({status, body}) => {
        expect(status).to.eq(200)
        cy.wrap(body[0]).as('accountMail')
    })

    cy.get('@accountMail').then((accountMail) => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/api/accounts/${accountMail.id}/inboxes`,
            headers: {
                "Api-Token": authConfig.mailtrapApiToken
            }
        }).then(({status, body}) => {
            expect(status).to.eq(200)
            cy.wrap(body[0]).as('inbox')
        })
    })

    cy.get('@inbox').then((inbox) => {
        cy.get('@accountMail').then((accountMail) => {
            cy.request({
                method: 'GET',
                url: `${BASE_URL}/api/accounts/${accountMail.id}/inboxes/${inbox.id}/messages/`,
                headers: {
                    "Api-Token": authConfig.mailtrapApiToken
                }
            }).then((response) => {
                response.body.forEach((item) => {
                    if (item.to_email === email) {
                        emailMessage = item
                    }
                })
                cy.request({
                    method: 'GET',
                    url: `${BASE_URL}${emailMessage.html_source_path}`,
                    headers: {
                        "Api-Token": authConfig.mailtrapApiToken
                    }
                }).then(({status, body}) => {
                    expect(status).to.eq(200)
                    emailMessage.token = body.slice(0, -1)
                    return cy.wrap(emailMessage)
                })
            })
        })
    })
})