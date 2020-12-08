export = Midtrans
declare namespace Midtrans {

    interface constructorOptions {
        isProduction: boolean,
        serverKey: string,
    }

    /**
     * Interface for midtrans class constructor
     * @example new midtransClient.Snap({...} as snapOptions)
     */
    export interface snapOptions extends constructorOptions { clientKey: string }
    /**
     * Interface for midtrans class constructor
     * @example new midtransClient.CoreApi({...} as coreApiOptions)
     */
    export interface coreApiOptions extends constructorOptions { clientKey: string }
    /**
     * Interface for midtrans class constructor
     * @example new midtransClient.Iris({...} as irisOptions)
     */
    export interface irisOptions extends constructorOptions { }

    /**
     * Interface for item details
     * @example const items: itemsDetails = {...}
     */
    export interface itemDetails {
        id: string,
        price: number,
        quantity: number,
        name: string,
        brand?: string,
        category?: string,
        merchant_name?: string,
        tenor?: string,
        code_plan?: string,
        mid?: string
    }
    
    /**
     * Interface for customer details
     * @example const customer: customerDetails = {...}
     */
    export interface customerDetails {
        first_name: string,
        last_name: string,
        email: string,
        phone?: string,
        billing_address?: {
            first_name: string,
            last_name: string,
            email: string,
            phone: string,
            address: string,
            city: string,
            postal_code: string,
            country_code: string
        },
        shipping_address?: {
            first_name: string,
            last_name: string,
            email: string,
            phone: string,
            address: string,
            city: string,
            postal_code: string,
            country_code: string
        }
    }

    type paymentType =
        "credit_card" |
        "gopay" |
        "cimb_clicks" |
        "bca_klikbca" |
        "bca_klikpay" |
        "bri_epay" |
        "telkomsel_cash" |
        "echannel" |
        "permata_va" |
        "other_va" |
        "bca_va" |
        "bni_va" |
        "bri_va" |
        "indomaret" |
        "danamon_online" |
        "akulaku" |
        "shopeepay" |
        "bank_transfer" |
        "cstore" |
        "kioson" |
        "indosat_dompetku" |
        "mandiri_ecash" |
        "mandiri_clickpay" |
        "gci"
    
    interface bcaText {
        en: string,
        id: string
    }

    /**
     * Collection of Typescript Interfaces for Snap API
     */
    export namespace SnapInterface {
        /**
         * You should use interface `transactionRequest` instead. This interface key-values is already included there.
         */
        interface completeRequest {
            item_details: Array<itemDetails>
            customer_details: customerDetails,
            enabled_payments: Array<paymentType>,
            credit_card?: {
                secure?: boolean,
                channel?: string,
                bank?: string,
                token_id?: string,
                installment_terms?: number,
                installment?: {
                    required: boolean,
                    terms: {
                        bni: Array<number>,
                        mandiri: Array<number>,
                        cimb: Array<number>,
                        bca: Array<number>,
                        offline: Array<number>
                    }
                },
                bins?: Array<number>,
                whitelist_bins?: Array<number | string>,
                dynamic_descriptor?: {
                    merchant_name: string,
                    city_name: string,
                    country_code: string
                },
                type?: string,
                save_token_id?: boolean
            },
            bca_va?: {
                va_number: string,
                sub_company_code?: string,
                free_text?: {
                    inquiry: Array<bcaText>,
                    payment: Array<bcaText>
                }
            },
            bni_va?: {
                va_number: string
            },
            bri_va?: {
                va_number: string
            },
            permata_va?: {
                va_number: string,
                recipient_name: string
            },
            shopeepay?: {
                callback_url: string
            },
            callbacks?: {
                finish: string,
            },
            expiry?: {
                start_time: string,
                unit: "day" | "hour" | "minute" | "days" | "hours" | "minutes",
                duration: number
            },
            custom_field1?: string | number | boolean | Record<string, string | number | boolean | symbol> | Array<string | number | boolean | symbol>,
            custom_field2?: string | number | boolean | Record<string, string | number | boolean | symbol> | Array<string | number | boolean | symbol>,
            custom_field3?: string | number | boolean | Record<string, string | number | boolean | symbol> | Array<string | number | boolean | symbol>
        }

        interface transactionRequest extends Partial<completeRequest> {
            transaction_details: {
                order_id: string,
                gross_amount: number
            }
        }

        /**
         * Response type for any Snap API function
         */
        interface response {
            token?: string,
            redirect_url?: string
        }
    }

    /**
     * Snap object used to do request to Midtrans Snap API
     * @class Snap
     * @see {@link https://snap-docs.midtrans.com/} Documentation
     */
    export class Snap {
        transaction: Transaction
        constructor(options: snapOptions)
        /**
         * Do `/transactions` API request to Snap API
         * @param {transactionRequest} parameters - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise<snapReturn>}
         * @see {@link https://snap-docs.midtrans.com/#endpoint} Documentation
         */
        createTransaction(parameters: SnapInterface.transactionRequest): Promise<SnapInterface.response | transactionError>

        /**
         * Wrapper function that call `createTransaction` then:
         * @param {transactionRequest} parameters - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise<string>} - Promise of String token
         * @see {@link https://snap-docs.midtrans.com/#token-storage} Documentation
         */
        createTransactionToken(parameters: SnapInterface.transactionRequest): Promise<string>

        /**
         * Wrapper function that call `createTransaction` then:
         * @param {transactionRequest} parameters - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise<string>} - Promise of String redirect_url
         * @see {@link https://snap-docs.midtrans.com/#token-storage} Documentation
         */
        createTransactionRedirectUrl(parameters: SnapInterface.transactionRequest): Promise<string>
    }

    namespace midtransError {
        interface customError {
            name?: string,
            ApiResponse?: string | number | Record<string | number, string | number | boolean | symbol> | null,
            message?: string,
            httpStatusCode?: string | number | null,
            rawHttpClientData?: string | number | Record<string | number, string | number | boolean | symbol> | null,
            stack?: string
        }
    
        interface errorResponse {
            error_message?: Array<string> | string,
            message?: Array<string> | string,
            errors?: Record<string, string | number | boolean | Array<string | number | boolean>>
        }
    }

    /**
     * Use this for handle type-checking of any error from Midtrans commands.
     * @example ... .catch((error: transactionError) => { ... })
     */
    export type transactionError = midtransError.errorResponse | midtransError.customError

    /**
     * Collection of Typescript Interface for Notification functions
     */
    export namespace NotificationInterface {
        /**
         * You should use interface `parameters` or `response` instead. This interface key-values is already included there.
         */
        interface parametersOptions {
            signature_key?: string,
            fraud_status?: string,
            approval_code?: string,
            bank?: string,
            channel_response_code?: string,
            channel_response_message?: string,
            card_type?: string,
            masked_card?: string,
            permata_va_number?: string,
            va_numbers?: Array<Record<string, string>>,
            bill_key?: string,
            biller_code?: string,
            currency?: string,
            merchant_id?: string,
            aquirer?: string,
            issuer?: string,
            settlement_time?: string,
            store?: "indomaret" | "alfamart"
        }

        interface parameters extends Partial<parametersOptions> {
            status_code: string,
            status_message: string,
            transaction_time: string,
            transaction_id: string,
            transaction_status: string,
            gross_amount: string,
            order_id: string,
            payment_type: paymentType
        }

        /**
         * Response type for any Notification function
         */
        interface response extends Partial<parametersOptions> {
            status_code?: string,
            status_message?: string,
            transaction_time?: string,
            transaction_id?: string,
            transaction_status: string,
            gross_amount?: string,
            order_id?: string,
            payment_type?: paymentType
        }
    }

    /**
     * These are wrapper/implementation of API methods described on: 
     * https://api-docs.midtrans.com/#midtrans-api
     * @class Transaction
     */
    export class Transaction {
        constructor(parentObj: ThisType<symbol | constructorOptions | null>)
        status(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        statusb2b(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        approve(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        deny(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        cancel(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        expire(transactionId?: string): Promise<Record<string, string | boolean | number> | transactionError>
        refund(transactionId?: string, parameter?: SnapInterface.transactionRequest): Promise<Record<string, string | boolean | number> | transactionError>
        refundDirect(transactionId?: string, parameter?: SnapInterface.transactionRequest): Promise<Record<string, string | boolean | number> | transactionError>
        notification(notificationObject?: NotificationInterface.parameters): Promise<NotificationInterface.response | transactionError>
    }

    /**
     * Collection of Typescript Interfaces for Core API
     */
    export namespace CoreApiInterface {
        type bankType = "permata" | "bca" | "mandiri" | "bni" | "bri"
        interface transactionRequest extends Partial<chargeOptions> {
            payment_type: paymentType
            transaction_details: {
                order_id: string,
                gross_amount: number
            }
        }
        /**
         * You should use interface `transactionRequest` instead. This interface key-values is already included there.
         */
        interface chargeOptions {
            item_details?: Array<itemDetails>,
            customer_details?: customerDetails,
            bank_transfer?: {
                bank: bankType,
                permata?: {
                    recipient_name: string
                },
                va_number?: string,
                free_text?: {
                    inquiry: bcaText,
                    payment: bcaText
                }
            },
            bca?: Record<string, string>
            echannel?: Record<string, string>,
            bca_klikpay?: {
                description: string
            },
            bca_klikbca?: {
                description: string,
                user_id: string
            },
            cimb_cliks?: {
                description: string
            },
            qris?: {
                aquirer: "airpay shopee" | "gopay"
            },
            gopay?: {
                enable_callback?: boolean,
                callback_url?: string,
                account_id?: string,
                payment_option_token?: string,
                pre_auth?: boolean
            },
            shopeepay?: {
                callback_url: string
            },
            cstore?: {
                store: "indomaret" | "alfamart",
                message?: string,
                alfamart_free_text_1?: string,
                alfamart_free_text_2?: string,
                alfamart_free_text_3?: string
            }
        }

        interface capture {
            transaction_id: string,
            gross_amount: number
        }

        interface cardRegister {
            card_number: string,
            card_exp_month: string, 
            card_exp_year: string,
            client_key: string,
            callback?: string
        }

        interface cardToken {
            card_number?: string,
            card_cvv: string,
            card_exp_month?: string,
            card_exp_year?: string,
            token_id?: string
        }

        /**
         * Response type for any CoreApi function
         */
        type response = Record<string, string | boolean | number>
    }

    /**
     * CoreApi object able to do API request to Midtrans Core API
     * @class CoreApi
     * @see {@link https://api-docs.midtrans.com/} Documentation
     */
    export class CoreApi {
        transaction: Transaction
        constructor(options: coreApiOptions)

        /**
         * Do `/charge` API request to Core API
         * @param {CoreApiInterface.charge} parameter 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://api-docs.midtrans.com/#charge-features} Documentation
         */
        charge(parameter: CoreApiInterface.transactionRequest): Promise<Record<string, string | boolean | number> | transactionError>
        
        /**
         * Do `/capture` API request to Core API
         * @param {CoreApiInterface.capture} parameter - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://api-docs.midtrans.com/#capture-transaction} Documentation
         */
        capture(parameter: CoreApiInterface.capture): Promise<Record<string, string | boolean | number> | transactionError>
        
        /**
         * Do `/card/register` API request to Core API
         * @param {CoreApiInterface.cardRegister} parameter - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://api-docs.midtrans.com/#register-card} Documentation
         */
        cardRegister(parameter: CoreApiInterface.cardRegister): Promise<Record<string, string | boolean | number> | transactionError>
        
        /**
         * Do `/token` API request to Core API
         * @param {CoreApiInterface.cardToken} parameter - object of Core API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://api-docs.midtrans.com/#get-token} Documentation
         */
        cardToken(parameter: CoreApiInterface.cardToken): Promise<Record<string, string | boolean | number> | transactionError>
        
        /**
         * Do `/point_inquiry/<tokenId>` API request to Core API
         * @param {string} tokenId - object of Core API JSON body as parameter, will be converted to JSON
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://api-docs.midtrans.com/#point-inquiry} Documentation
         */
        cardPointInquiry(tokenId: string): Promise<Record<string, string | boolean | number> | transactionError>
    }

    /**
     * Collection of Typescript Interface for Iris API
     */
    export namespace IrisInterface {
        interface beneficiary {
            name: string,
            account: number,
            bank: string,
            alias_name: string,
            email: string
        }

        interface simpleResponse {
            status: string
        }

        interface payoutsBeneficiary {
            beneficiary_name: string,
            beneficiary_account: string,
            beneficiary_bank: string,
            beneficiary_email?: string,
            amount: string,
            notes?: string,
            bank_account_id?: string
        }

        interface payoutsResult {
            status: string,
            reference_no: string
        }

        interface payoutsApprove {
            reference_no: Array<string>
            otp: string
        }

        interface payoutsReject {
            reference_no: Array<string>,
            reject_reason: string
        }

        interface payoutsDetail {
            amount?: string,
            beneficiary_name?: string,
            beneficiary_account?: string,
            bank?: string,
            reference_no?: string,
            notes?: string,
            beneficiary_email?: string,
            account?: string,
            type?: string,
            status?: string,
            created_by?: string,
            created_at?: string,
            updated_at?: string
        }

        interface transactionHistory {
            account: string,
            type: string,
            amount: string,
            status: string,
            created_at: string
        }

        interface topupChannel {
            id: number,
            virtual_account_type: string,
            virtual_account_number: string
        }

        interface bankAccount {
            bank_account_id?: string,
            bank_name?: string,
            account_name?: string,
            account_number?: string,
            status?: string
        }

        interface bankList {
            code: string,
            name: string
        }

        interface validateBank {
            bank: string,
            account: string
        }

        /**
         * Response type for any Iris function. 
         */
        type response = simpleResponse | beneficiary | { payouts: Array<payoutsResult> } |
            payoutsDetail | Array<transactionHistory | payoutsDetail> | Array<topupChannel> |
            { balance: string } | Array<bankAccount> | Array<bankList> |
            { account_name: string, account_no: string, bank_name: string}
    }
    /**
     * Iris object able to do API request to Midtrans Iris API
     * @class Iris
     * @see {@link https://iris-docs.midtrans.com/} Documentation
     */
    export class Iris {
        transaction: Transaction
        constructor(options: irisOptions)

        /**
         * Do `/ping` API request to Iris API
         * @return {Promise} Literally "pong"
         * @see {@link https://iris-docs.midtrans.com/#ping} Documentation
         */
        ping(): Promise<string | transactionError>

        /**
         * Do create `/beneficiaries` API request to Iris API
         * @param {IrisInterface.beneficiary} parameter - object of Iris API JSON body as parameter, will be converted to JSON
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#create-beneficiaries} Documentation
         */
        createBeneficiaries(parameter: IrisInterface.beneficiary): Promise<IrisInterface.simpleResponse | transactionError>
        
        /**
         * Do update `/beneficiaries/<alias_name>` API request to Iris API
         * @param {String} aliasName alias_name of the beneficiaries that need to be updated
         * @param {IrisInterface.beneficiary} parameter object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#update-beneficiaries} Documentation
         */
        updateBeneficiaries(aliasName: string, parameter: IrisInterface.beneficiary): Promise<IrisInterface.simpleResponse | transactionError>
        
        /**
         * Do `/beneficiaries` API request to Iris API
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#list-beneficiaries} Documentation
         */
        getBeneficiaries(): Promise<Array<IrisInterface.beneficiary> | transactionError>
        
        /**
         * Do create `/payouts` API request to Iris API
         * @param {Array<IrisInterface.payoutsBeneficiary} parameter object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#create-payouts} Documentation
         */
        createPayouts(parameter: { payouts: Array<IrisInterface.payoutsBeneficiary> }): Promise<{ payouts: Array<IrisInterface.payoutsResult> } | transactionError>
        
        /**
         * Do approve `/payouts/approve` API request to Iris API
         * @param {IrisInterface.payoutsApprove} parameter object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#approve-payouts} Documentation
         */
        approvePayouts(parameter: IrisInterface.payoutsApprove): Promise<IrisInterface.simpleResponse | transactionError>
        
        /**
         * Do reject `/payouts/reject` API request to Iris API
         * @param {IrisInterface.payoutsReject} parameter object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#reject-payouts} Documentation
         */
        rejectPayouts(parameter: IrisInterface.payoutsReject): Promise<IrisInterface.simpleResponse | transactionError>
        
        /**
         * Do `/payouts/<reference_no>` API request to Iris API
         * @param {String} referenceNo reference_no of the payout
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#get-payout-details} Documentation
         */
        getPayoutDetails(referenceNo: string): Promise<IrisInterface.payoutsDetail | transactionError>
        
        /**
         * Do `/statements` API request to Iris API
         * @param {Object} transaction object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#transaction-history} Documentation
         */
        getTransactionHistory(transaction: { from_date: string, to_date: string }): Promise<Array<IrisInterface.transactionHistory | IrisInterface.payoutsDetail> | transactionError>
        
        /**
         * Do `/channels` API request to Iris API
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#top-up-channel-information-aggregator} Documentation
         */
        getTopupChannels(): Promise<Array<IrisInterface.topupChannel> | transactionError>
        
        /**
         * Do `/balance` API request to Iris API
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#check-balance-aggregator} Documentation
         */
        getBalance(): Promise<{ balance: string } | transactionError>
        
        /**
         * Do `/bank_accounts` API request to Iris API
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#bank-accounts-facilitator} Documentation
         */
        getFacilitatorBankAccounts(): Promise<Array<IrisInterface.bankAccount> | transactionError>
        
        /**
         * Do `/bank_accounts/<bank_account_id>/balance` API request to Iris API
         * @param {String} bankAccountId 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#check-balance-facilitator} Documentation
         */
        getFacilitatorBalance(bankAccountId: string): Promise<{ balance: string } | transactionError>
        
        /**
         * Do `/beneficiary_banks` API request to Iris API
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#list-banks} Documentation
         */
        getBeneficiaryBanks(): Promise<{beneficiary_banks: Array<IrisInterface.bankList>} | transactionError>
        
        /**
         * Do `/account_validation` API request to Iris API
         * @param {IrisInterface.validateBank} parameters object of Iris API JSON body as parameter, will be converted to JSON 
         * @return {Promise} - Promise contains Object from JSON decoded response
         * @see {@link https://iris-docs.midtrans.com/#validate-bank-account} Documentation
         */
        validateBankAccount(parameters: IrisInterface.validateBank): Promise<{ account_name: string, account_no: string, bank_name: string} | transactionError>
    }
}
