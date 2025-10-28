const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor')

const enviarMensagem = (texto) => {
  cy.get('[aria-label="input-mensagem"]').clear().type(texto)
  cy.get('[aria-label="botao-enviar"]').click()
}

Given('que eu abro a página de chat', () => {
  cy.visit('/')
  cy.get('.bubble').its('length').as('initialMessageCount')
})

When('eu digito {string} e envio a mensagem', (text) => {
  enviarMensagem(text)
})

When('eu digito uma mensagem longa e envio', () => {
  const longMessage = 'Esta é uma mensagem muito longa para testes. '.repeat(20)
  enviarMensagem(longMessage)
})

When('eu envio {string} e depois {string}', (first, second) => {
  enviarMensagem(first)
  cy.get('[aria-label="botao-enviar"]').should('not.be.disabled')
  enviarMensagem(second)
})

When('eu tento enviar uma mensagem vazia', () => {
  cy.get('[aria-label="input-mensagem"]').clear()
  cy.get('[aria-label="botao-enviar"]').click()
})

When('eu redimensiono a janela para tamanho mobile', () => {
  cy.viewport(375, 667)
})

Then('eu devo ver uma resposta do bot contendo {string}', (expected) => {
  cy.contains('.bubble.bot', expected, { timeout: 6000 }).should('exist')
})

Then('eu devo ver duas respostas do bot cada uma contendo {string}', (expected) => {
  cy.get('.bubble.bot', { timeout: 8000 }).should('have.length.at.least', 3)
  cy.get('.bubble.bot').then(($els) => {
    const len = $els.length
    cy.wrap($els.eq(len - 2)).should('contain.text', expected)
    cy.wrap($els.eq(len - 1)).should('contain.text', expected)
  })
})

Then('nenhuma nova mensagem deve aparecer', () => {
  cy.get('@initialMessageCount').then((initialCount) => {
    cy.get('.bubble').should('have.length', initialCount)
  })
})

Then('a UI de chat deve permanecer funcional', () => {
  cy.get('[aria-label="input-mensagem"]').should('be.visible')
  cy.get('[aria-label="botao-enviar"]').should('be.visible')
})

When('eu solicito a abertura de um atendimento para {string} com contato {string}', (nome, contato) => {
  enviarMensagem(`abrir atendimento nome=${nome} contato=${contato}`)

  cy.get('.bubble.bot', { timeout: 8000 })
    .should('have.length.at.least', 2)
    .last()
    .should('contain.text', 'Atendimento #')
    .should('contain.text', nome)
    .invoke('text')
    .then((text) => {
      const match = text.match(/Atendimento #(\d+)/)
      expect(match, 'id do atendimento criado').to.not.be.null
      cy.wrap(match[1]).as('ultimoAtendimentoId')
      cy.wrap(text).as('ultimaRespostaBot')
    })
})

Then('o bot confirma a criação do atendimento', () => {
  cy.get('@ultimaRespostaBot').should('contain', 'criado')
})

When('eu consulto o status do último atendimento', () => {
  cy.get('@ultimoAtendimentoId').then((id) => {
    enviarMensagem(`status atendimento ${id}`)

    cy.get('.bubble.bot', { timeout: 8000 })
      .last()
      .should('contain.text', `Atendimento #${id}`)
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('ultimaRespostaBot')
      })
  })
})

Then('o bot responde que o atendimento está {string}', (status) => {
  cy.get('@ultimaRespostaBot').should('contain', `status ${status}`)
})

When('eu fecho o último atendimento', () => {
  cy.get('@ultimoAtendimentoId').then((id) => {
    enviarMensagem(`fechar atendimento ${id}`)

    // Aguarda explicitamente por uma nova resposta do bot que confirme o encerramento.
    // Usamos `cy.contains` para buscar a string esperada 'agora está' — isso evita confusão
    // com a resposta anterior que também contém 'Atendimento #<id>'.
    cy.contains('.bubble.bot', 'agora está', { timeout: 10000 })
      .should('contain.text', `Atendimento #${id}`)
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('ultimaRespostaBot')
      })
  })
})

Then('o bot confirma que o atendimento foi encerrado', () => {
  cy.get('@ultimaRespostaBot').should('contain', 'agora está closed')
})
