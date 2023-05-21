const axios = require('axios');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "luizalabsdesafio@gmail.com",
        pass: process.env.SENHA_EMAIL
    }
})

class EmailAdapter {

    /**
    *   @param {String} email -> E-mail destino.
    *   @param {String} html -> Texto html para corpo do e-mail.
    *   @param {String} assunto -> Assunto do e-mail.
    */
    async enviaEmail(email, html, assunto) {
        try {
            await transport.sendMail({
                from: "Desafio Luizalabs <luizalabsdesafio@gmail.com>",
                to: email,
                subject: assunto,
                html: html,
            })

            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}

module.exports = new EmailAdapter();