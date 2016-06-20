import React from 'react'

function Home () {
  return (
    <article>
      <p>This boilerplate contains a super minimal set of dependencies in order to get
      you up and running with a universal react project, whilst also providing you with a great development experience that includes hot reloading of the client and server code.</p>

      <p>It doesn't try to dictate how you should build your entire application, rather it provides a clean and simple base on which you can expand.</p>

      <h2>Overview</h2>

      <p>The boilerplate uses Webpack 2 to produce bundles for both the client and the
      server code.  You will notice two Webpack configuration files that allow you to target the respective environments:</p>

      <ul>
        <li><code>webpack.client.config.js</code></li>
        <li><code>webpack.server.config.js</code></li>
      </ul>

      <p>All code is executed via the webpack bundles, in both development and production mode.</p>

      <p>It includes a very basic <code>express</code> server with a minimal security configuration.</p>

      <p>Routing is achieved via <code>react-router</code>.</p>

      <p>Application configuration is achieved using the <code>dotenv</code> module.</p>

      <h2>Get it running on your machine</h2>

      <p>Clone the repository.</p>

      <pre><code>git clone https://github.com/ctrlplusb/react-universally</code></pre>

      <p>The application depends on environment settings which are exposed to the application via a <code>.env</code> file.  You will have to create one of these using the example version (<code>.env_example</code>).  You could simply copy the example:</p>

      <pre><code>cp .env_example .env</code></pre>

      <p>I would recommend that you review the options within the <code>.env</code> file.</p>

      <p>That's it. You can then execute the npm script commands to build/execute the application.</p>

      <h2>npm script commands</h2>

      <h3><code>npm run development</code></h3>

      <p>Starts a development server for both the client and server bundles.  We use <code>react-hot-loader</code> v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.</p>

      <h3><code>npm run build</code></h3>

      <p>Builds the client and server bundles, with the output being production optimized.</p>

      <h3><code>npm run start</code></h3>

      <p>Executes the server.  It expects you to have already built the bundles either via the <code>npm run build</code> command or manually.</p>

      <h3><code>npm run clean</code></h3>

      <p>Deletes any build output that would have originated from the other commands.</p>

      <h2>References</h2>

      <ul>
        <li><strong>Webpack 2</strong> - <a href='https://gist.github.com/sokra/27b24881210b56bbaff7'>https://gist.github.com/sokra/27b24881210b56bbaff7</a></li>
        <li><strong>React Hot Loader v3</strong> - <a href='https://github.com/gaearon/react-hot-boilerplate/pull/61'>https://github.com/gaearon/react-hot-boilerplate/pull/61</a></li>
        <li><strong>dotenv</strong> - <a href='https://github.com/bkeepers/dotenv'>https://github.com/bkeepers/dotenv</a></li>
      </ul>
    </article>
  )
}

export default Home
