const withPWA = require("next-pwa");

module.exports = process.env.NODE_ENV === 'development' ?
  { reactStrictMode: true }
  :
  withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true

    }
  });
