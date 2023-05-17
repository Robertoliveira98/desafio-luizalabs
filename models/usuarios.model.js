var mongoose = require('mongoose'),
Schema = mongoose.Schema;


const usuarios = new Schema({
    nome: { type: String },
    email: { type: String },
    senha: { type: String },
    dataCadastro: { type: Date, default: Date.now }
  });

  usuarios.index({'email': 1});

module.exports = mongoose.model('usuarios', usuarios);
