'use strict'

const axios = require('axios');
const querystring = require('querystring');
const MidtransError = require('./midtransError');
/**
 * Wrapper of Axios to do API request to Midtrans API
 * @return {Promise} of API response, or exception during request
 * capable to do HTTP `request`
 */
class HttpClient{
  constructor(){
    this.http_client = axios;
  }
  request(httpMethod,serverKey,requestUrl,parameter={}){
    let payload = parameter;
    let headers = {
      'content-type': 'application/json',
      'accept': 'application/json',
      'user-agent': 'midtransclient-nodejs/1.1.0'
    };
    return new Promise(function(resolve,reject){
      // Reject if param is not JSON
      if(typeof parameter === 'string' || parameter instanceof String){
        try{
          parameter = JSON.parse(parameter);
        }catch(err){
          reject(new MidtransError(`fail to parse 'parameters' string as JSON. Use JSON string or Object as 'parameters'. with message: ${err}`));
        }
      }
      let response = axios({
        method: httpMethod,
        headers: headers,
        url: requestUrl,
        data: httpMethod != 'get' ? payload : null,
        params: httpMethod == 'get' ? payload : null,
        auth: {
          username: serverKey,
          password: ''
        }
      }).then(function(res){
        // Reject core API error status code
        if(res.data.hasOwnProperty('status_code') && res.data.status_code >= 300 && res.data.status_code != 407){
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
        if(res.status >= 300){
          reject(
            new MidtransError(
              `Midtrans API is returning API error. HTTP status code: ${res.status}. API response: ${JSON.stringify(res.data)}`,
              res.status,
              res.data,
              res
            )
          )
        }
        reject(err);
      })
    });
  }
}

module.exports = HttpClient;