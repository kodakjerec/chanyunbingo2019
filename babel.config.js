const additionPlugins = []
if (process.env.NODE_ENV === 'production') {
  additionPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: additionPlugins
}
