const usuariosModel = require('../models/usuarios.model');
const jwt = require('jsonwebtoken');
const chaveJwt = "desafioLabs";

class CadastroService {

    async cadastrarUsuario(body) {

        let user = await usuariosModel.create(body)

        return user;
    }
    
    async login(body) {

        let user = await usuariosModel.findOne({email: body.email}).lean();
        let result = { valido: false, token: "", mensagem: "" };

        if (user && user.senha == body.senha) {
            const token = this._gerarTokenJWT(user);
            result.valido = true;
            result.token = token;
        } else {
            result.mensagem = user ? "Senha incorreta" : "Usuário não encontrado";
        }

        return result;
    }
    
    _gerarTokenJWT(usuario) {
        return jwt.sign(usuario, chaveJwt, { expiresIn: "4h" });
    }

    _getValueOrDefault(obj, path, defaultValue = undefined) {
        try {
            let prop = this._getProp(obj, path);
            if (typeof prop === 'undefined') return defaultValue;
            return prop;
        } catch (error) {
            return defaultValue;
        }
    }

    _getProp(obj, desc) {
        var arr = desc.split('.');
        while (arr.length) {
            obj = obj[arr.shift()];
        }
        return obj;
    }
}

module.exports = new CadastroService();