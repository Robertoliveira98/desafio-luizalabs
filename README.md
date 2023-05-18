
# Banco de dados
MongoDB v4.4.6

Executar em http://localhost:27017

Nome do banco: "desafiolabs"

# Instalação
Node v14.16.0

```bash 
npm install
```

# Execução

```bash
npm start
```

Executado em http://localhost:3000.

# Endpoints

## POST http://localhost:3000/usuario/cadastro
Realiza cadastro do usuário.

## POST http://localhost:3000/usuario/login
Valida login e retorna token jwt de login.

## POST http://localhost:3000/usuario/recuperar
Envia email para recuperação de senha.

# Testes unitários
```bash
npm test
```
