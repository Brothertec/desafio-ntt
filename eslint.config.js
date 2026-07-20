const pluginCypress = require('eslint-plugin-cypress')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = [
  pluginCypress.configs.recommended,
  eslintConfigPrettier,
]
