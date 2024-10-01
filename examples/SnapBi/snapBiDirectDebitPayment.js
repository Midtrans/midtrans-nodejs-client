
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
let directDebiRequestBody = {
    "partnerReferenceNo": externalId,
    "chargeToken": "",
    "merchantId": merchantId,
    "urlParam": {
        "url": "https://midtrans-test.com/api/notification",
        "type": "PAY_RETURN",
        "isDeeplink": "N"
    },
    "validUpTo": "2030-07-20T20:34:15.452305Z",
    "payOptionDetails": [
        {
            "payMethod": "GOPAY",
            "payOption": "GOPAY_WALLET",
            "transAmount": {
                "value": "1500",
                "currency": "IDR"
            }
        }
    ],
    "additionalInfo": {
        "customerDetails": {
            "firstName": "Merchant",
            "lastName": "Operation",
            "email": "merchant-ops@midtrans.com",
            "phone": "+6281932358123",
            "billingAddress": {
                "firstName": "Merchant",
                "lastName": "Operation",
                "phone": "+6281932358123",
                "address": "Pasaraya Blok M",
                "city": "Jakarta",
                "postalCode": "12160",
                "countryCode": "IDN"
            },
            "shippingAddress": {
                "firstName": "Merchant",
                "lastName": "Operation",
                "phone": "+6281932358123",
                "address": "Pasaraya Blok M",
                "city": "Jakarta",
                "postalCode": "12160",
                "countryCode": "IDN"
            }
        },
        "items": [
            {
                "id": "8143fc4f-ec05-4c55-92fb-620c212f401e",
                "price": {
                    "value": "1500.00",
                    "currency": "IDR"
                },
                "quantity": 1,
                "name": "test item name",
                "brand": "test item brand",
                "category": "test item category",
                "merchantName": "Merchant Operation"
            }
        ]
    }
}

let additionalHeader = {
    "X-device-id": "your device id",
    "debug-id": "your debug id"
}

/**
 * Example code for Direct Debit (gopay/ dana/ shopeepay) using Snap Bi.
 * Below are example code to create payment
 */

/**
 * Basic example.
 * To change the payment method, you can change the value of the request body on the `payOptionDetails`
 */
SnapBi.directDebit()
    .withBody(directDebiRequestBody)
    .createPayment(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )

/**
 * Example of using existing access token to create payment.
 * To change the payment method, you can change the value of the request body on the `payOptionDetails`
 */
SnapBi.directDebit()
    .withBody(directDebiRequestBody)
    .withAccessToken("your access token")
    .createPayment(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )
/**
 * Adding custom header during both access token & transaction process request by using .withAccessTokenHeader() .withTransactionHeader()
 */
SnapBi.directDebit()
    .withBody(directDebiRequestBody)
    .withAccessTokenHeader(additionalHeader)
    .withTransactionHeader(additionalHeader)
    .createPayment(externalId)
    .then(r =>
        console.log("Snap Bi result: " + JSON.stringify(r, null, 2))
    )






