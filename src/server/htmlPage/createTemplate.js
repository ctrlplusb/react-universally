import serialize from 'serialize-javascript'

// :: [String] -> [String]
function cssImports (css) {
  return css
    .map(cssPath =>
      `<link href="${cssPath}" media="screen, projection" rel="stylesheet" type="text/css" />`
    )
    .join('\n')
}

// :: [String] -> [String]
function javascriptImports (javascript) {
  return javascript
    .map(scriptPath =>
      `<script type="text/javascript" src="${scriptPath}"></script>`
    )
    .join('\n')
}

// :: Object -> [String]
function metaTags (meta) {
  return Object.keys(meta).map(metaKey =>
    `<meta name="${metaKey}" content="${meta[metaKey]}" />`
  )
}

// :: Assets -> Content -> String
function createTemplate (assets = {}) {
  const { css = [], javascript = [] } = assets

  const cssLinks = cssImports(css)
  const javascriptScripts = javascriptImports(javascript)

  return function pageTemplate (content = {}) {
    const { title, meta = {}, initialState = {}, reactRootElement } = content

    return `<!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta httpEquiv='Content-Language' content='en' />

        <title>${title}</title>

        ${metaTags(meta)}

        ${cssLinks}
      </head>
      <body>
        <div id='app'>${reactRootElement}</div>

        <script type='text/javascript'>
          window.APP_STATE=${serialize(initialState)};
        </script>

        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
        ${javascriptScripts}
      </body>
    </html>`
  }
}

export default createTemplate
