import React from 'react';
import Helmet from 'react-helmet';

const contributors = [
  {
    name: 'Alin Porumb',
    url: 'https://github.com/alinporumb',
  },
  {
    name: 'Benjamin Kniffler',
    url: 'https://github.com/bkniffler',
  },
  {
    name: 'Carson Perrotti',
    url: 'https://github.com/carsonperrotti',
  },
  {
    name: 'Christian Glombek',
    url: 'https://github.com/LorbusChris',
  },
  {
    name: 'Christoph Werner',
    url: 'https://github.com/codepunkt',
  },
  {
    name: 'David Edmondson',
    url: 'https://github.com/threehams',
  },
  {
    name: 'Dion Dirza',
    url: 'https://github.com/diondirza',
  },
  {
    name: 'Evgeny Boxer',
    url: 'https://github.com/evgenyboxer' },
  {
    name: 'Joe Kohlmann',
    url: 'https://github.com/kohlmannj',
  },
  {
    name: 'Lucian Lature',
    url: 'https://github.com/lucianlature',
  },
  {
    name: 'Steven Enten',
    url: 'https://github.com/enten',
  },
  {
    name: 'Sean Matheson',
    url: 'https://github.com/ctrlplusb',
  },
  {
    name: 'Steven Truesdell',
    url: 'https://github.com/strues',
  },
  {
    name: 'Tom',
    url: 'https://github.com/datoml',
  },
];

function About() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Helmet title="About" />

      <p>Produced with ❤️ by...</p>

      <ul style={{ marginTop: '1rem' }}>
        {
          contributors.map(({ name, url }) =>
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            </li>,
          )
        }
      </ul>
    </div>
  );
}

export default About;
