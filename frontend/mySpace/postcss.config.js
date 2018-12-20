module.exports = {
  plugins: [
    require("precss")(),
    // require('postcss-import'),
    /*
         可以配置'ie 6-8'或者'> 1%'或者'last 2 versions'
         */
    require("autoprefixer")({
      browsers: ["last 2 versions"]
    }),
    require("cssnano")({})
  ]
};
