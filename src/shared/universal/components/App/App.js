/* @flow */

import React from 'react';
import { Match, Miss } from 'react-router';
import Helmet from 'react-helmet';
import CodeSplit from 'code-split-component';
import 'normalize.css/normalize.css';
import './globals.css';
import Error404 from './views/Error404';
import Header from './Header';
import runTasksForLocation from '../../taskRoutes/runTasksForLocation';
import { WEBSITE_TITLE, WEBSITE_DESCRIPTION } from '../../constants';
import type { Location } from '../../types/react-router';

type Props = {
  location?: Location,
};

class App extends React.Component {
  props: Props;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location != null && nextProps.location !== this.props.location) {
      // The location has changed so we will attempt to run any route tasks
      // that are matched for the new location.
      const executingTasks = runTasksForLocation(
        nextProps.location,
        ['prefetchData', 'defferedData'],
        {}
      );

      if (executingTasks) {
        // Tasks are being executed...
        executingTasks.then(({ routes }) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Finished tasks for routes', routes); // eslint-disable-line no-console,max-len
          }
        });
      }
    }
  }

  render() {
    return (
      <div style={{ padding: '10px' }}>
        {/*
          All of the following will be injected into our page header.
          @see https://github.com/nfl/react-helmet
        */}
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          titleTemplate={`${WEBSITE_TITLE} - %s`}
          defaultTitle={WEBSITE_TITLE}
          meta={[
            { name: 'description', content: WEBSITE_DESCRIPTION },
          ]}
          script={[]}
        />

        <Header />

        <Match
          exactly
          pattern="/"
          render={routerProps =>
            <CodeSplit module={System.import('./views/Home')}>
              { Home => Home && <Home {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Match
          pattern="/about"
          render={routerProps =>
            <CodeSplit module={System.import('./views/About')}>
              { About => About && <About {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Miss component={Error404} />
      </div>
    );
  }
}

export default App;
