/* Controlador para conectarse a google-sheets-api a través de node,
el codigo está en spanglish. Cualquier reclamo o comentario sobre el 
codigo se puede hacer en el siguiente link: http://fifa.com/reclamos */

var fs = require('fs');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// Variables para guardar el token en el disco y después volver a usarlo
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-ponderador.json';


function autorizar(credenciales, callback, data) {
    /* funcion que recibe las credenciales y una funcion que se ejecutara
    en el caso que las credenciales estén correctas.

    @params {Object} credenciales: las credenciales para validar al cliente
    @params {function} callback: funcion que se ejecutara después de validar */

    var clientSecret = credenciales.installed.client_secret;
    var clientId = credenciales.installed.client_id;
    var redirectUrl = credenciales.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Revisar si ya existe un token guardado en disco
    fs.readFile(TOKEN_PATH, function(err, token) {
        if(err) {
            // En el caso que no exista un token, se pide uno nuevo
            recibir_token_nuevo(oauth2Client, callback, data);
        } else {
            // En el caso que si exista se ejecuta la funcion callback
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, data);
        };
    });
};


function recibir_token_nuevo(oauth2Client, callback, data) {
    /* funcion que solicita un nuevo token para validar al cliente y después
    de validar se ejecuta una funcion callback

    @params {Object} oauth2client: cliente oauth para pedir nuevo token
    @params {function} callback: funcion que se ejecutara después de validar */

    // Generar un link aleatorio para validar al cliente
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    // Se despliega el link en la consola y se pide ingresar el codigo
    console.log('Autorizar esta aplicación desde esta pagina: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Ingresar el codigo para autorizar al cliente: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error intentando validar el código', err);
                return;
            };
            oauth2Client.credentials = token;
            // Se llama a la funcion para guardar el token recibido en disco
            guardar_token(token);
            // Se ejecuta la funcion callback si se valida correctamente
            callback(oauth2Client, data);
        });
    });
};


function guardar_token(token) {
    /* funcion para guardar el token en disco. Recibe y el token y lo 
    guarda en el path de la variable declarada más arriba

    @params {Object} token: token a guardar en disco como .json */

    try {
        // Intentar guardar el token en el directorio declarado arriba
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        // Si ocurre un error distinto a que el archivo ya existía se levanta
        // un error
        if (err.code != 'EEXIST') {
            throw err;
        };
    };
    // Guardar el token en el path indicado
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token guardado en el path: ' + TOKEN_PATH);
};


function agregar_usuario(auth, data) {
    /* FALTA DOCUMENTAR ESTA FUNCION */

    var sheets = google.sheets('v4');
    var opciones = {
        auth: auth,
        spreadsheetId: '1P1AG8b8PIA_Q8xmczUkR_DFa3zPdnZ2-dbgZ0jIkI-o',
        range: 'Hoja 1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
                values: [data]
        }
    };
    // Subir a Google Drive con las opciones de arriba
    sheets.spreadsheets.values.append(opciones, function(err, res) {
        if (err) {
            console.log('Ocurrió un error al intentar subir el usuario: ' + err);
        } else {
            console.log('Se subió correctamente un usuario: ' + res);
        }
     });
};

module.exports = {
    subir_usuario: function(data_usuario) {
        fs.readFile('client_secret.json' function procesar_secrets(err, content) {
            if (err) {
                console.log('Ocurrió un error al intentar leer las credenciales: ' + err);
                return;
            } else {
                // Llamar a la funcion para autorizar al cliente
                autorizar(JSON.parse(content), agregar_usuario);
                return;
            };
        }); 
    };
};