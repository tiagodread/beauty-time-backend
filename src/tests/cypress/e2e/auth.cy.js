import {faker} from '@faker-js/faker';

describe('/register', () => {
    let name, email, password = undefined
    beforeEach(() => {
        name = faker.name.fullName()
        email = faker.internet.email().toLowerCase()
        password = faker.internet.password(20, true)
    })

    it('Should return 400 when name is not specified', () => {
        name = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: {name, email, password},
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })

    it('Should return 400 when email is not specified', () => {
        email = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: {name, email, password},
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })

    it('Should return 400 when password is not specified', () => {
        password = undefined
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: {name, email, password},
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect((xhr.statusText)).to.eq('Bad Request')
            expect(xhr.body.error.name).to.eq('ValidationError')
        })
    })

    it('Should be able to register successfully just once', () => {
        cy.createAccount(name, email, password)
        // Make sure duplicate users cannot register
        cy.request({
            method: 'POST',
            url: '/auth/register',
            body: {name, email, password},
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(400)
            expect(xhr.statusText).to.eq('Bad Request')
            expect(xhr.body).to.eql({error: 'User already exists'})
        })
    })
})

describe('/authenticate', () => {
    let name, email, password = undefined
    beforeEach(() => {
        name = faker.name.fullName()
        email = faker.internet.email().toLowerCase()
        password = faker.internet.password(20, true)
    })

    it('Can authenticate successfully', () => {
        cy.createAccount(name, email, password)
        cy.request({
            method: 'POST',
            url: '/auth/authenticate',
            body: {email, password},
            failOnStatusCode: false
        }).then((xhr) => {
            expect(xhr.status).to.eq(200)
            expect(xhr.body).to.have.property('token')
            expect(xhr.body.user.name).to.eq(name)
            expect(xhr.body.user.email).to.eq(email)
            expect(xhr.body.user.createdAt).to.not.be.empty
            expect(xhr.body.user._id).to.not.be.empty
        })
    })

    it.skip('Can not authenticate with bad credentials', () => {
        cy.createAccount(name, email, password)

    })
})
