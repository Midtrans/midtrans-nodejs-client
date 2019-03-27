# Sample Express App

Example of checkout page using Midtrans Snap & Core Api. A quick and secure way to accept payment.

This is a very simple, very minimalist example to demonstrate integrating
Midtrans Snap with Express (Node JS).

## Run Without docker

1. Install latest Node JS (Node v9 for instance, as used by this example) & npm
2. Clone the repository, open terminal in this `expressApp` folder.
3. Install dependencies `npm install`
4. Run the web server using:
	- `node app.js`, or
	- `npm start`, or
  - \*for development `npm run start:dev`

## Usage

The app will run at port 3000.
Open `localhost:3000` from browser.

To test `/notification_handler`, you can execute this CURL:
```bash
curl -X POST \
  http://localhost:3000/notification_handler \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
  "transaction_time": "2018-11-05 12:16:53",
  "transaction_status": "capture",
  "transaction_id": "9a83774c-b56b-4724-acf2-c35d73834a36",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "d302bfcb2db008f17343e4c3b56cb20a0b22d0951ede6a7cdbfcd31f4a5d0d89d0a5230c333dd2fc5803cfbe8567ad146fb3c574d4050a87b4d81661e5d870de",
  "payment_type": "credit_card",
  "order_id": "order-id-node-1541395013",
  "masked_card": "481111-1114",
  "gross_amount": "200000.00",
  "fraud_status": "accept",
  "eci": "05",
  "channel_response_message": "Approved",
  "channel_response_code": "00",
  "card_type": "credit",
  "bank": "mandiri",
  "approval_code": "1541395013424"
}'
```
Or point your `notification url` on Midtrans dashboard to `/notification_handler` url. Then do some transaction/payment on sandbox, then check your app log.

## Run With Docker
> required: Docker installed.

- First time to build & run: `docker build -t midexpress . && docker run -p 3000:3000 --rm -it midexpress`.
- Next time just run `docker run -p 3000:3000 --rm -it midexpress`