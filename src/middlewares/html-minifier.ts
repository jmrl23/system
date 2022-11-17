import minifyHTML from 'express-minify-html-terser'

export const htmlMinifier = minifyHTML({
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
