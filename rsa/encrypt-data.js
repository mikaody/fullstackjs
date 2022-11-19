const encryptor = (dataToEncrypt) => {
    /**
     * requirement module
     */
    //import crypto module cryptor level
    const crypto = require('crypto');
    //import fs module file reader
    const fs = require('fs');

    /**
     * requirement public key
     */
    const publicKey = Buffer.from(fs.readFileSync('rsa/public.pem', { encoding: 'utf-8' }))

    // encrypt result with public key and sha256
    var encryptedData = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(dataToEncrypt)
    );

    // format result to string base 64
    encryptedData = encryptedData.toString("base64")
    return encryptedData
}

//export function encryptor and become module as name encryptor
exports.encryptor = encryptor