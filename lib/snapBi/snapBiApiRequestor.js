const axios = require('axios');
const SnapBiConfig = require('./snapBiConfig');
const https = require("https");

// Set up axios interceptors
axios.interceptors.request.use(
    function (config) {
        if (SnapBiConfig.enableLogging) {
            console.log(`Request URL: ${config.url}`);
            console.log(`Request Headers: \n${JSON.stringify(config.headers, null, 2)}`);
            if (config.data) {
                console.log(`Request Body: \n${JSON.stringify(config.data, null, 2)}`);
            }
        }
        return config;
    },
    function (error) {
        if (SnapBiConfig.enableLogging) {
            console.error(`Request Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        if (SnapBiConfig.enableLogging) {
            console.log(`Response Status: ${response.status}`);
            console.log(`Response Body: \n${JSON.stringify(response.data, null, 2)}`);
        }
        return response;
    },
    function (error) {
        if (SnapBiConfig.enableLogging) {
            console.error(`Response Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

class SnapBiApiRequestor {
    /**
     * Make a remote API call with the specified URL, headers, and request body.
     * @param {string} url - The API endpoint URL.
     * @param {object} header - The headers for the request.
     * @param {object} body - The JSON payload for the request.
     * @returns {Promise<object>} - The JSON response from the API.
     */
    static async remoteCall(url, header, body, timeout = 10000) {
        const axiosHeaders = { ...header };
        try {
            const axiosOptions = {
                headers: axiosHeaders,
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            };
            if (timeout !== null) {
                axiosOptions.timeout = timeout;
            }
            const response = await axios.post(url, body, axiosOptions);
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return { message: error.message, status: error.code || 500 };
            }
        }
    }
}

module.exports = SnapBiApiRequestor;
