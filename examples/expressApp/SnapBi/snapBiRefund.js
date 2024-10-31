
const midtransClient = require('midtrans-client'); // use this if installed via NPM

// This is just for very basic implementation reference, in production, you should validate the incoming requests and implement your backend more securely.
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
const externalId = randomUUID();


midtransClient.SnapBiConfig.snapBiPrivateKey = private_key;
midtransClient.SnapBiConfig.snapBiClientSecret = clientSecret;
midtransClient.SnapBiConfig.snapBiPartnerId = partnerId;
midtransClient.SnapBiConfig.snapBiChannelId = channelId;
midtransClient.SnapBiConfig.snapBiClientId = clientId
midtransClient.SnapBiConfig.enableLogging = true;


const externalId = randomUUID();

let directDebitRefundBody = {
    "originalReferenceNo": "A1202409300808041pswnOt7wMID",
    "reason" : "refund reason"
}

let qrisRefundBody = {
    "merchantId": merchantId,
    "originalPartnerReferenceNo": "488fd30e-64d7-4236-9e7a-82d55d9efad3",
    "originalReferenceNo": "A1202409300907114b5RZRNSRuID",
    "partnerRefundNo": "is-refund-12345",
    "reason": "refund reason",
    "refundAmount": {
        "value": "100.00",
        "currency": "IDR"
    },
    "additionalInfo": {
        "foo": "bar"
    }
}

let additionalHeader = {
    "X-device-id": "your device id",
    "debug-id": "your debug id"
}

/**
 * Example code for refund using Direct Debit (gopay/ dana/ shopeepay).
 */

midtransClient.SnapBi.directDebit()
    .withBody(directDebitRefundBody)
    .refund(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitRefundBody)
    .withAccessToken("your access token")
    .refund(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitRefundBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .refund(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for refund using Qris,
 */

midtransClient.SnapBi.qris()
    .withBody(qrisRefundBody)
    .refund(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.qris()
    .withBody(qrisRefundBody)
    .withAccessToken("your access token")
    .refund(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.qris()
    .withBody(qrisRefundBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .refund("408c0226-c53d-4dd7-8d79-ce3c09278de0")
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )






