const usuarioService = require("../../services/usuario.service");
const usuariosModel = require("../../models/usuarios.model");
const emailAdapter = require("../../adapters/email.adapter");
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
let sandbox = require("sandbox");
const jwt = require('jsonwebtoken');

beforeEach(() => {
	sandbox = sinon.createSandbox();
});

afterEach(() => {
	sandbox.restore();
});

describe("Class usuarioService", () => {
	describe("Method cadastrarUsuario", () => {
		it("Usuario duplicado", async () => {
			let mock = { sucesso: false }
			const stub = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve({ nome: "nome" })
				}
			});

			const response = await usuarioService.cadastrarUsuario({ nome: "nome", email: "a@a.com" });
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});

		it("Usuario Criado e erro ao enviar email", async () => {
			let mock = { sucesso: true, usuario: { nome: "nome" }, emailEnviado: false }
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve(undefined)
				}
			});

			const stubCreate = sandbox.stub(usuariosModel, "create").resolves({ nome: "nome" });
			const stubEmail = sandbox.stub(usuarioService, "_enviaEmailCadastro").resolves(false);
			const response = await usuarioService.cadastrarUsuario({ nome: "nome", email: "a@a.com" });

			expect(stubFindOne.calledOnce).to.be.true;
			expect(stubCreate.calledOnce).to.be.true;
			expect(stubEmail.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});

		it("Usuario Criado e email enviado", async () => {
			let mock = { sucesso: true, usuario: { nome: "nome" }, emailEnviado: true }
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve(undefined)
				}
			});

			const stubCreate = sandbox.stub(usuariosModel, "create").resolves({ nome: "nome" });
			const stubEmail = sandbox.stub(usuarioService, "_enviaEmailCadastro").resolves(true);
			const response = await usuarioService.cadastrarUsuario({ nome: "nome", email: "a@a.com" });

			expect(stubFindOne.calledOnce).to.be.true;
			expect(stubCreate.calledOnce).to.be.true;
			expect(stubEmail.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});
	});

	describe("Method login", () => {
		it("Usuario não encontrado", async () => {
			let mock = { valido: false, token: "", mensagem: "Usuário não encontrado" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve(undefined)
				}
			});

			const response = await usuarioService.login({ senha: "12345", email: "a@a.com" });
			expect(stubFindOne.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});

		it("Senha incorreta", async () => {
			let mock = { valido: false, token: "", mensagem: "Senha incorreta" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve({ senha: "abcde" })
				}
			});

			const response = await usuarioService.login({ senha: "12345", email: "a@a.com" });
			expect(stubFindOne.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});

		it("Usuario logado", async () => {
			let mock = { valido: true, token: "a1b2c3", mensagem: "" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve({ senha: "12345" })
				}
			});
			const stubToken = sandbox.stub(usuarioService, "_gerarTokenJWT").returns("a1b2c3");

			const response = await usuarioService.login({ senha: "12345", email: "a@a.com" });
			expect(stubFindOne.calledOnce).to.be.true;
			expect(stubToken.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});
	});

	describe("Method recuperarSenha", () => {
		it("Usuario não encontrado", async () => {
			let mock = { emailEnviado: false, mensagem: "Usuário não encontrado" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve(undefined)
				}
			});

			const response = await usuarioService.recuperarSenha("a@a.com");
			expect(stubFindOne.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});
		it("Erro envio do email", async () => {
			let mock = { emailEnviado: false, mensagem: "Erro ao enviar E-mail de recuperação. Favor, realizar nova tentativa!" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve({ email: "a@a.com", nome: "a" })
				}
			});
			const stubEmail = sandbox.stub(usuarioService, "_enviaEmailRecuperacao").returns(false);

			const response = await usuarioService.recuperarSenha("a@a.com");
			expect(stubFindOne.calledOnce).to.be.true;
			expect(stubEmail.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});
		it("Sucesso", async () => {
			let mock = { emailEnviado: true, mensagem: "E-mail de recuperação enviado" };
			const stubFindOne = sandbox.stub(usuariosModel, "findOne").returns({
				lean: () => {
					return Promise.resolve({ email: "a@a.com", nome: "a" })
				}
			});
			const stubEmail = sandbox.stub(usuarioService, "_enviaEmailRecuperacao").returns(true);

			const response = await usuarioService.recuperarSenha("a@a.com");
			expect(stubFindOne.calledOnce).to.be.true;
			expect(stubEmail.calledOnce).to.be.true;
			expect(response).to.deep.equal(mock);
		});
	});

	describe("Method _gerarTokenJWT", () => {
		it("token gerado", done => {
			let mockUsuario = { nome: "a", email: "b", senha: "c" };
			const stub = sandbox.stub(jwt, "sign").returns("a1b2c3");
			const response = usuarioService._gerarTokenJWT(mockUsuario);
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal("a1b2c3");
			done();
		});
	});

	describe("Method _enviaEmailRecuperacao", () => {
		it("Email enviado com sucesso", async () => {
			const stub = sandbox.stub(emailAdapter, "enviaEmail").resolves(true);
			const response = await usuarioService._enviaEmailRecuperacao("a", "b", "c");
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal(true);
		});

		it("Erro no envio do email", async () => {
			const stub = sandbox.stub(emailAdapter, "enviaEmail").resolves(false);
			const response = await usuarioService._enviaEmailRecuperacao("a", "b", "c");
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal(false);
		});
	});

	describe("Method _enviaEmailCadastro", () => {
		it("Email enviado com sucesso", async () => {
			const stub = sandbox.stub(emailAdapter, "enviaEmail").resolves(true);
			const response = await usuarioService._enviaEmailCadastro("a", "b");
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal(true);
		});

		it("Erro no envio do email", async () => {
			const stub = sandbox.stub(emailAdapter, "enviaEmail").resolves(false);
			const response = await usuarioService._enviaEmailCadastro("a", "b");
			expect(stub.calledOnce).to.be.true;
			expect(response).to.deep.equal(false);
		});
	});
});
