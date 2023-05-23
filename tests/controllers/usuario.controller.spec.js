const usuarioService = require('../../services/usuario.service');
const app = require("../../app");
const sinon = require('sinon');
const chai = require('chai');
const request = require("supertest");
const expect = chai.expect;
let sandbox = require('sandbox');

beforeEach(() => {
    sandbox = sinon.createSandbox();
});

afterEach(() => {
    sandbox.restore();
});

describe('Class UsuarioController', () => {

    describe('Method cadastrarUsuario', () => {
        let payload = { nome: "a", senha: "b", email: "c" };
        it('Sucesso', async () => {

            let mock = { sucesso: true };

            sandbox.stub(usuarioService, "cadastrarUsuario").resolves(mock);
            const res = await request(app).post('/usuario/cadastro').send(payload)
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mock);
        });
        it('Usuário já existe', async () => {

            let mock = { mensagem: "Usuário já existe" };

            sandbox.stub(usuarioService, "cadastrarUsuario").resolves({ sucesso: false });
            const res = await request(app).post('/usuario/cadastro').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
        it('Erro', async () => {

            let mock = { mensagem: "Erro ao cadastrar usuários" };

            sandbox.stub(usuarioService, "cadastrarUsuario").rejects();
            const res = await request(app).post('/usuario/cadastro').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
    });

    describe('Method login', () => {
        let payload = { senha: "b", email: "c" };
        it('Sucesso', async () => {

            let mock = { valido: true };

            sandbox.stub(usuarioService, "login").resolves(mock);
            const res = await request(app).post('/usuario/login').send(payload)
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mock);
        });
        it('Usuário não existe ou senha invalida', async () => {

            let mock = { mensagem: "mensagem de erro" };

            sandbox.stub(usuarioService, "login").resolves({ valido: false, mensagem: "mensagem de erro" });
            const res = await request(app).post('/usuario/login').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
        it('Erro', async () => {

            let mock = { mensagem: "Falha ao fazer login" };

            sandbox.stub(usuarioService, "login").rejects();
            const res = await request(app).post('/usuario/login').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
    });

    describe('Method recuperarSenha', () => {
        let payload = { email: "c" };
        it('Sucesso', async () => {

            let mock = { emailEnviado: true };

            sandbox.stub(usuarioService, "recuperarSenha").resolves(mock);
            const res = await request(app).post('/usuario/recuperar').send(payload)
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mock);
        });
        it('Email não enviado', async () => {

            let mock = { mensagem: "mensagem de erro" };

            sandbox.stub(usuarioService, "recuperarSenha").resolves({ emailEnviado: false, mensagem: "mensagem de erro" });
            const res = await request(app).post('/usuario/recuperar').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
        it('Erro', async () => {

            let mock = { mensagem: "Falha ao enviar e-mail de recuperação" };

            sandbox.stub(usuarioService, "recuperarSenha").rejects();
            const res = await request(app).post('/usuario/recuperar').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
    });

    describe('Method alterarSenha', () => {
        let payload = { email: "c" };
        it('Sucesso', async () => {

            let mock = { sucesso: true };

            sandbox.stub(usuarioService, "alterarSenha").resolves(mock);
            const res = await request(app).put('/usuario/alterarSenha').send(payload)
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mock);
        });
        it('Email não enviado', async () => {

            let mock = { mensagem: "Usuário não encontrado" };

            sandbox.stub(usuarioService, "alterarSenha").resolves({ sucesso: false, mensagem: "Usuário não encontrado" });
            const res = await request(app).put('/usuario/alterarSenha').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
        it('Erro', async () => {

            let mock = { mensagem: "Falha ao alterar senha" };

            sandbox.stub(usuarioService, "alterarSenha").rejects();
            const res = await request(app).put('/usuario/alterarSenha').send(payload)
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal(mock);
        });
    });

});
