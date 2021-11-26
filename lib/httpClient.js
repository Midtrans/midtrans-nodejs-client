'use strict'

const axios = require('axios').default;
const querystring = require('querystring');
const MidtransError = require('./midtransError');
/**
 * Wrapper of Axios to do API request to Midtrans API
 * @return {Promise} of API response, or exception during request
 * capable to do HTTP `request`
 */
class HttpClient{
  constructor(parentObj={}){
    this.parent = parentObj;
    this.http_client = axios.create();
  }
  request(httpMethod,serverKey,requestUrl,firstParam={},secondParam={}){
    let headers = {
      'content-type': 'application/json',
      'accept': 'application/json',
      'user-agent': 'midtransclient-nodejs/1.3.0'
    };

    let reqBodyPayload = {};
    let reqQueryParam = {};
    if(httpMethod.toLowerCase() == 'get'){
      // GET http request will use first available param as URL Query param
      reqQueryParam = firstParam;
      reqBodyPayload = secondParam;
    } else {
      // Non GET http request will use first available param as JSON payload body
      reqBodyPayload = firstParam;
      reqQueryParam = secondParam;
    }

    // to avoid anonymous function losing `this` context, 
    // can also replaced with arrow-function instead which don't lose context
    let thisInstance = this;
    return new Promise(function(resolve,reject){
      // Reject if param is not JSON
      if(typeof reqBodyPayload === 'string' || reqBodyPayload instanceof String){
        try{
          reqBodyPayload = JSON.parse(reqBodyPayload);
        }catch(err){
          reject(new MidtransError(`fail to parse 'body parameters' string as JSON. Use JSON string or Object as 'body parameters'. with message: ${err}`));
        }
      }
      // Reject if param is not JSON
      if(typeof reqQueryParam === 'string' || reqQueryParam instanceof String){
        try{
          reqQueryParam = JSON.parse(reqQueryParam);
        }catch(err){
          reject(new MidtransError(`fail to parse 'query parameters' string as JSON. Use JSON string or Object as 'query parameters'. with message: ${err}`));
        }
      }

      let response = thisInstance.http_client({
        method: httpMethod,
        headers: headers,
        url: requestUrl,
        data: reqBodyPayload,
        params: reqQueryParam,
        auth: {
          username: serverKey,
          password: ''
        }
      }).then(function(res){
        // Reject core API error status code
        if(res.data.hasOwnProperty('status_code') && res.data.status_code >= 400 && res.data.status_code != 407){
          // 407 is expected get-status API response for `expire` transaction, non-standard
          reject(
            new MidtransError(
              `Midtrans API is returning API error. HTTP status code: ${res.data.status_code}. API response: ${JSON.stringify(res.data)}`,
              res.data.status_code,
              res.data,
              res
            )
          )
        }
        resolve(res.data);
      }).catch(function(err){
        let res = err.response;
        // Reject API error HTTP status code
        if(typeof res !== 'undefined' && res.status >= 400){
          reject(
            new MidtransError(
              `Midtrans API is returning API error. HTTP status code: ${res.status}. API response: ${JSON.stringify(res.data)}`,
              res.status,
              res.data,
              res
            )
          )
        // Reject API undefined HTTP response 
        } else if(typeof res === 'undefined'){
          reject(
            new MidtransError(
              `Midtrans API request failed. HTTP response not found, likely connection failure, with message: ${JSON.stringify(err.message)}`,
              null,
              null,
              err
            )
          )
        }
        reject(err);
      })
    });
  }
}

module.exports = HttpClient;
