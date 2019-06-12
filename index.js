const dgram = require('dgram');
const repl = require('repl');

const config = {
    port: 43,
    host: 'whois.registro.br',
    version: 0,
    lang: 1
};
let token;

const client = dgram.createSocket('udp4');

client.on('message', (msg, info) => {
    const response = msg.toString();
    if (response.startsWith("CK")) {
        token = response.split(" ")[1];
    }
    console.log('Data received from server:\n ' + msg.toString());
});

function buildMessage(fqdn) {
    const messageString = `${config.version} ${token} ${config.lang} 53 ${fqdn}`;
    return Buffer.from(messageString);
}

function queryDomain(fqdn) {
    // if (fqdn && !token) {
    //     return setTimeout(() => queryDomain(fqdn), 300);
    // }
    const message = buildMessage(fqdn);
    client.send(message, 0, message.length, config.port, config.host, (err, bytes) => {
        if (err) client.close();
    });
    return "Processando!";
};

queryDomain(); // initialize token

function eval(domain, context, filename, callback) {
    // callback(null, queryDomain(domain));
    queryDomain(domain)
}

repl.start({ prompt: 'domínio > ', eval });