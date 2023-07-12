/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'prod';
process.env.HOST = process.env.HOST || '127.0.0.1';
process.env.PORT = process.env.PORT || 4000;
process.env.SITE_NAME = process.env.SITE_NAME || 'NFT Talent';

// console.log(process.env.NODE_ENV, process.env.HOST, 'configured');
