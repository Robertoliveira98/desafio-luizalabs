const service = require('../services/usuario.service');
class CadastroController {

    async cadastrarUsuario(req, res, next) {

        try {
            let result = await service.cadastrarUsuario(req.body);
            if (result.sucesso) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ mensagem: "Usuário já existe" });
            }
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao cadasrar usuários" });
        }
    }

    async login(req, res, next) {

        try {
            let data = await service.login(req.body);

            if (data.valido) {
                res.status(200).json(data);
            } else {
                res.status(500).json({ mensagem: data.mensagem });
            }

        } catch (error) {
            res.status(500).json({ mensagem: "Falha ao fazer login" });
        }
    }

    async recuperarSenha(req, res, next) {

        try {
            let data = await service.recuperarSenha(req.body.email);

            if (data.emailEnviado) {
                res.status(200).json(data);
            } else {
                res.status(500).json({ mensagem: data.mensagem });
            }

        } catch (error) {
            res.status(500).json({ mensagem: "Falha ao enviar e-mail de recuperação" });
        }
    }

    async alterarSenha(req, res, next) {

        try {
            let data = await service.alterarSenha(req.body.email, req.body.senha);

            if (data.sucesso) {
                res.status(200).json(data);
            } else {
                res.status(500).json({ mensagem: data.mensagem });
            }

        } catch (error) {
            res.status(500).json({ mensagem: "Falha ao alterar senha" });
        }
    }


}
module.exports = new CadastroController();