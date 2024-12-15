// vue.config.js
const path = require('path');

module.exports = {
  // Optimize build for a component library (not an application)
  configureWebpack: {
    output: {
      library: 'AmadPlayer', // The global variable for your component library
      libraryTarget: 'umd',  // Allows your library to be used in different environments (CommonJS, AMD, or as a global)
      umdNamedDefine: true,  // Ensures the library is named in UMD builds
    },
    externals: {
      vue: 'Vue',  // Exclude Vue from the bundle, requiring users to install it separately
    },
    optimization: {
      splitChunks: {
        chunks: 'all',  // Split chunks to reduce file sizes and improve cache performance
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),  // Alias for your 'src' folder, makes imports cleaner
      },
    },
  },
  
  // CSS extraction configuration
  css: {
    extract: false, // Don't extract CSS during the build, so it's bundled with the JavaScript
  },
  
  // Enable source maps for easier debugging
  productionSourceMap: false,  // Disable source maps in production for smaller bundle size

  // Additional settings can go here as needed for your project
};
