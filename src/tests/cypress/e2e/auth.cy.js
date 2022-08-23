import { faker } from '@faker-js/faker';

describe('Invalid Registration', () => {
    let body = {}
    beforeEach(() => {
        body = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(20, true)
        }
    })

    it('Should return 400 when name is not specified', () => {
        body.name = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: body,
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })

    it('Should return 400 when email is not specified', () => {
        body.email = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: body,
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })

    it('Should return 400 when password is not specified', () => {
        body.password = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: body,
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })
})

describe('Valid Registration', () => {
    it('Should be able to register successfully once', () => {
        const body = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(20, true)
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
        // Make sure duplicate users cannot register
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: body,
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect(xhr.statusText).to.eq('Bad Request')
            expect(xhr.body).to.eql({error: 'User already exists'})
        })

    })
})
