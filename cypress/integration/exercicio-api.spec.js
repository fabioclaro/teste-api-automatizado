/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import contrato from '../contracts/users.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.duration).to.be.lessThan(150)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          const name = faker.name.fullName()
          let email = faker.internet.email()
          cy.cadastrarUsuario(name, email, 'teste', 'true')
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('Beltrano do Vale', 'beltrano@qa.com', 'teste', 'true')
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               });
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.editarUsuario('Tadeu novo nome', 'tadeu@qa.com', 'teste', 'true')
               .then((response) => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          const name = faker.name.fullName()
          let usuario = faker.internet.email()
          cy.cadastrarUsuario(name, usuario, "teste", "false")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });


});
