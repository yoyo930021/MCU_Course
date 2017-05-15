module.exports = {
  postcss: [
    require('autoprefixer')({
      browsers: ['last 5 versions','Chrome >= 21','Firefox >= 28']
    })
  ],
  buble: {
    objectAssign: 'Object.assign',
  },
}
