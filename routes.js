const controllers = require('./controllers');
const usuarioController = require('./controllers/usuario.controller');

module.exports = function (app) {

    app.get('/', controllers.index);

    app.post('/usuario/cadastro', (req, res, next) => {
        usuarioController.cadastrarUsuario(req, res, next);
    });

    app.post('/usuario/login', (req, res, next) => {
        usuarioController.login(req, res, next);
    });

    app.post('/usuario/recuperar', (req, res, next) => {
        usuarioController.recuperarSenha(req, res, next);
    });

}