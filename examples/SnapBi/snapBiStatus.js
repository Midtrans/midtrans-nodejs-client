
// const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.

const {SnapBiConfig, SnapBi} = require("../../index");
const { randomUUID } = require('crypto');

/**
 * Setup your credentials here to try the example code.
 */

const clientId = "Zabcdefg-MIDTRANS-CLIENT-SNAP";

// Ensure to include newlines properly in the private key as shown below
const private_key = `-----BEGIN PRIVATE KEY-----
BCDEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7Zk6kJjqamLddaN1lK03XJW3vi5zOSA7V+5eSiYeM9tCOGouJewN/Py58wgvRh7OMAMm1IbSZpAbcZbBa1=
-----END PRIVATE KEY-----`;
const clientSecret = "ABcdefghiSrLJPgKRXqdjaSAuj5WDAbeaXAX8Vn7CWGHuBCfFgABCDVqRLvNZf8BaqPGKaksMjrZDrZqzZEbaA1AYFwBewIWCqLZr4PuvuLBqfTmYIzAbCakHKejABCa";
const partnerId = "partner-id";
const merchantId = "M001234";
const channelId = "12345";

SnapBiConfig.snapBiPrivateKey = private_key;
SnapBiConfig.snapBiClientSecret = clientSecret;
SnapBiConfig.snapBiPartnerId = partnerId;
SnapBiConfig.snapBiChannelId = channelId;
SnapBiConfig.snapBiClientId = clientId
SnapBiConfig.enableLogging = true;

const externalId = randomUUID();

let directDebitStatusBodyByExternalId = {
    "originalExternalId": "67fd4d9e-5fe6-477c-ab99-026a9ab88c34",
    "serviceCode": "54"
}
let directDebitStatusBodyByReferenceNo = {
    "originalReferenceNo": "A120240930071006pW0gbFMTguID",
    "serviceCode": "54"
}

let vaStatusBody = {
    "partnerServiceId": "    1234",
    "customerNo": "356899",
    "virtualAccountNo": "    1234356899",
    "inquiryRequestId": "5a5597d1-615d-4df0-875d-aa429b2b1b68",
    "additionalInfo": {
        "merchantId": merchantId
    }
}

let qrisStatusBody = {
    "originalReferenceNo": "A120240930074508BIDP4QaNnJID",
    "originalPartnerReferenceNo": "b7d2bc2e-9d5b-4cec-a39f-4244c11e1b98",
    "merchantId": merchantId,
    "serviceCode": "47"
}

let additionalHeader = {
    "X-device-id": "your device id",
    "debug-id": "your debug id"
}

/**
 * Example code for SnapBI status.
 * For Direct Debit, to get the transaction status you can use externalId or referenceNo.
 * you can refer to the variable directDebitStatusBodyByReferenceNo or directDebitStatusBodyByExternalId (for direct debit).
 * For VA you can refer to the variable vaStatusBody to see the value.
 * For Qris you can refer to qrisStatusBody to see the value.
 *
 * Below are example code to get the transaction status.
 */


/**
 * Example code for Direct Debit to get the transaction status using externalId
 */
SnapBi.directDebit()
    .withBody(directDebitStatusBodyByExternalId)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.directDebit()
    .withBody(directDebitStatusBodyByExternalId)
    .withAccessToken("your access token")
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.directDebit()
    .withBody(directDebitStatusBodyByExternalId)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for Direct Debit to get the transaction status using referenceNo
 */
SnapBi.directDebit()
    .withBody(directDebitStatusBodyByReferenceNo)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.directDebit()
    .withBody(directDebitStatusBodyByReferenceNo)
    .withAccessToken("your access token")
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.directDebit()
    .withBody(directDebitStatusBodyByReferenceNo)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for VA to get the transaction status.
 */
SnapBi.va()
    .withBody(vaStatusBody)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.va()
    .withBody(vaStatusBody)
    .withAccessToken("your access token")
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.va()
    .withBody(vaStatusBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )
/**
 * Example code for Qris to get the transaction status.
 */
SnapBi.qris()
    .withBody(qrisStatusBody)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.qris()
    .withBody(qrisStatusBody)
    .withAccessToken("your access token")
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

SnapBi.qris()
    .withBody(qrisStatusBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .getStatus(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )






