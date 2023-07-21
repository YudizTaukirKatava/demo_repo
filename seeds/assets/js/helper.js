/*---------------------------------------------*
This file requires import of following js cdns:
- jQuery (v3.6.0)
- web3.js (v1.7.4)
- dataTable (v1.10.18)
- ejs (v3.1.8)
- tilt.js

- chains.web3.js
*----------------------------------------------*/

const _helper = {};
const web3_core = new Web3();

_helper.chainSymbolById = function (id) {
    return _chains_web3[id].nativeCurrency.symbol;
};

_helper.trimEthereumAddress = function (sWalletAddress, len) {
    return (
        sWalletAddress.substring(0, len) +
        '...' +
        sWalletAddress.substring(sWalletAddress.length - len)
    );
};

_helper.copyToClipboard = async function (text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
};

_helper.valueMultiply = function (val1, val2) {
    return _helper.toEther(Number(val1) * Number(_helper.toWei(val2)));
};

_helper.toUsd = function (val1, val2) {
    return Number(val1) * Number(val2);
};

_helper.findFromObjectArray = function (arr, key, value) {
    return arr.find((item) => {
        return item[key] === value;
    });
};

/* web3 */

_helper.toEther = function (amount) {
    return web3_core.utils.fromWei(amount.toString(), 'ether');
};

_helper.toWei = function (amount) {
    return web3_core.utils.toWei(amount.toString());
};

_helper.toWeb3ContractObject = function (web3_obj, address, abi) {
    return new web3_obj.eth.Contract(abi, address);
};

/* ajax */

_helper.call_API = function (sMethod, sPath, oData = {}, oHeader = {}) {
    return new Promise((resolve, reject) => {
        let configObj = {
            method: sMethod,
            url: _API_BASE_URL + sPath,
            headers: oHeader,
            data: oData,
        };

        // if uploading file
        if (oData instanceof FormData) {
            configObj['processData'] = false;
            configObj['contentType'] = false;
        }

        $.ajax({
            ...configObj,
            success: function (result, status, xhr) {
                return resolve(xhr.responseJSON.data);
            },
            error: function (xhr, status, error) {
                return reject(xhr.responseJSON.message);
            },
        });
    });
};

/* ajax v2*/

_helper.call_API_v2 = function (sMethod, sPath, oData = {}, oHeader = {}) {
    return new Promise((resolve, reject) => {
        let configObj = {
            method: sMethod,
            url: _API_BASE_URL + sPath,
            headers: oHeader,
            data: oData,
        };

        // if uploading file
        if (oData instanceof FormData) {
            configObj['processData'] = false;
            configObj['contentType'] = false;
        }

        $.ajax({
            ...configObj,
            success: function (result, status, xhr) {
                return resolve(xhr.responseJSON);
            },
            error: function (xhr, status, error) {
                return reject(xhr.responseJSON?.message || error);
            },
        });
    });
};

/* datatable */

_helper.getDataTableAJAX = function (sMethod, sPath) {
    return {
        url: _API_BASE_URL + sPath,
        type: sMethod,
        headers: {
            Authorization: localStorage.getItem('AuthorizationAdmin'),
        },
        dataFilter: function (data) {
            const json = jQuery.parseJSON(data);
            return JSON.stringify(json.data); // return JSON string
        },
    };
};

/* ejs */
/*
example usage:

_helper.generateHtmlFromEJS(_card_templates.collection, { sName: 'Collection #1' })
*/
_helper.generateHtmlFromEJS = function (template, data) {
    return ejs.render(template, { data });
};

/* tilt.js */

_helper.addTiltEffect = function (ele) {
    ele.tilt({
        maxTilt: 5,
        glare: true,
        maxGlare: 0.5,
    });
};
