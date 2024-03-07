export default {
  // serverSideUrl: 'http://server.4mean.mx',
  // port: 3018,
  // serverSideUrl: 'http://192.168.15.6', // home
  // port: 3010,
  serverSideUrl: 'https://api.aerocontaxi.com.mx', // work
  port: 443,
  //serverSideUrl: 'http://192.168.1.68',
  //port: 3010,
  // serverSideUrl: 'http://3.12.119.112',
  // port: 3000,
  //    serverSideUrl: 'http://192.168.43.197', // work from phone hot spot
  //    port: 3010,
  //  serverSideUrl: 'http://10.1.17.131', // UERRE
  //  port: 3010,
  //    serverSideUrl: 'http://192.168.15.24', // Lily
  //    port: 3010,

  openPay: {
    url: 'https://api.openpay.mx/v1/m0edznwalqbjbuwxpx6e/tokens',
    publicKey: 'pk_131e98e16ef441599265579e9ad12e9d',
  },
  openPayDev: {
    url: 'https://sandbox-api.openpay.mx/v1/my7g7bmiiq6vxsztm85d/tokens',
    publicKey: 'pk_93e023b4cc354e31a968a92761108766',
  },
  awsImage: {
    coupons: 'https://s3.us-east-2.amazonaws.com/urgi-api-files/coupons/',
  },
};
