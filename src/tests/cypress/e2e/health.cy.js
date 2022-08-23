describe('System health', () => {
  it('System health check', () => {
    cy.request({
      method: 'GET',
      url: '/health',
    }).then( ({status, body }) => {
      expect(status).to.eq(200)
      expect(body.status).to.eq('OK')
    })
  })
})