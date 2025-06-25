const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname), // Alias '@' aponta para a raiz do projeto
};

module.exports = config;
