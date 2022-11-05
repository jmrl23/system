import minifyHTML from 'express-minify-html-terser'

const htmlMinifier = minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: true,
    minifyJS: true
  }
})

export { htmlMinifier }
