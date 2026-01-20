const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    resolveRequest: (context, moduleName, platform) => {
      // Manually resolve make-plural to its entry point
      if (moduleName === 'make-plural') {
        return {
          filePath: path.resolve(__dirname, 'node_modules/make-plural/plurals.js'),
          type: 'sourceFile',
        };
      }
      // Handle make-plural subpaths
      if (moduleName.startsWith('make-plural/')) {
        const subpath = moduleName.replace('make-plural/', '');
        return {
          filePath: path.resolve(__dirname, `node_modules/make-plural/${subpath}.js`),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(defaultConfig, config));