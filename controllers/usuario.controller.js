const service = require('../services/usuario.service');
class CadastroController {

    async cadastrarUsuario(req, res, next) {

        try {
            let usuario = await service.cadastrarUsuario(req.body);
            res.status(200).json(usuario);
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


}
module.exports = new CadastroController();