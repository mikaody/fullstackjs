const decryptor = (encryptedData) => {
    const crypto = require('crypto')
    const fs = require('fs')

    /**
     * requirement private key
     */
    const privateKey = fs.readFileSync('rsa/private.pem', { encoding: 'utf-8' })

    var decryptedData = crypto.privateDecrypt({
            key: privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(encryptedData, 'base64'),
    )

    decryptedData = decryptedData.toString("utf-8")
    return decryptedData;
}

exports.decryptor = decryptor