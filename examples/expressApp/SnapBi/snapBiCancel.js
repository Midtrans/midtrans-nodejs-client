
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

let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction : false,
    serverKey : 'YOUR_SERVER_KEY'
});

midtransClient.SnapBiConfig.snapBiPrivateKey = private_key;
midtransClient.SnapBiConfig.snapBiClientSecret = clientSecret;
midtransClient.SnapBiConfig.snapBiPartnerId = partnerId;
midtransClient.SnapBiConfig.snapBiChannelId = channelId;
midtransClient.SnapBiConfig.snapBiClientId = clientId
midtransClient.SnapBiConfig.enableLogging = true;

let directDebitCancelByReferenceNoBody = {
    "originalReferenceNo" : "A120241031082957gyKCzhKqB2ID"
}

let directDebitCancelByExternalIdBody = {
    "originalExternalId" : "8a074fc8-4eac-4b06-959a-95aeb91c7920"
}

let vaCancelBody = {
    "partnerServiceId": "    1234",
    "customerNo": "564902",
    "virtualAccountNo": "    1234564902",
    "trxId": "18f2bd6d-e1be-43e2-89e4-8f9088251f60",
    "additionalInfo": {
        "merchantId": merchantId
    }
}

let qrisCancelBody = {
    "originalReferenceNo": "A120240930075936LUOBMHxvPOID",
    "merchantId": merchantId,
    "reason": "cancel reason"
}

let additionalHeader = {
    "X-device-id": "your device id",
    "debug-id": "your debug id"
}
/**
 * Example code for SnapBI cancel.
 * For Direct Debit, to cancel transaction you can use externalId or referenceNo.
 * you can refer to the variable directDebitCancelByReferenceNoBody or directDebitCancelByExternalIdBody (for direct debit).
 * For VA you can refer to the variable vaCancelBody to see the value.
 * For Qris you can refer to qrisCancelBody to see the value.
 *
 * Below are example code to cancel the transaction.
 */

/**
 * Example code for Direct Debit to cancel using referenceNo
 */
midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByReferenceNoBody)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByReferenceNoBody)
    .withAccessToken("your access token")
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByReferenceNoBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for Direct Debit cancel using externalId
 */
midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByExternalIdBody)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByExternalIdBody)
    .withAccessToken("your access token")
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.directDebit()
    .withBody(directDebitCancelByExternalIdBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for VA (Bank Transfer) to cancel transaction
 */
midtransClient.SnapBi.va()
    .withBody(vaCancelBody)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.va()
    .withBody(vaCancelBody)
    .withAccessToken("your access token")
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.va()
    .withBody(vaCancelBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .cancel("9af65919-8f31-45a5-b4f5-722c3664696d")
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example code for Qris to cancel transaction
 */
midtransClient.SnapBi.qris()
    .withBody(qrisCancelBody)
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.qris()
    .withBody(qrisCancelBody)
    .withAccessToken("your access token")
    .cancel(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

midtransClient.SnapBi.qris()
    .withBody(qrisCancelBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .cancel("9af65919-8f31-45a5-b4f5-722c3664696d")
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )







