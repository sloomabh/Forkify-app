///////////////////////////////////////////////////////////////////////////////////////////////////////////
//the goal of this file or of this module is to contain a couple of functions that we reuse over and over in our project.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { TIMEOUT_SEC } from './config';
//it will return a new promise. So this promise here,which will reject after a certain number of seconds.And so in order to now use this function here,we will have a race between this time out promise which will take whatever seconds we pass into it,and this fetch function here,which is the one responsible for getting the data.And then whatever occurs first will win the race.
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            //information about the request itself
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData), //The data that we want to send
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
/////////////////////////////// Refactored (export const AJAX )//////////////////////////////
//Get data from API
/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // we throw or owen error message up to this line  for example wrong ID
    return data; // we should return something---- this data is going to be the resolved value of the promise that the getJSON function returns.
  } catch (err) {
    throw err; // her we rethrow the error to be showed up in the model not here
  }
};

// Send Data to API
export const sendJSON = async function (url, uploadData) {
  try {
    //beside the url we need add object of options
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        //information about the request itself
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData), //The data that we want to send
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // we should return something---- this data is going to be the resolved value of the promise that the getJSON function returns.
  } catch (err) {
    throw err; // her we rethrow the error to be showed up in the model not here
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
 */
