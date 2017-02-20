/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import Error404 from '../index';

describe('<Error404 />', () => {
  test('renders', () => {
    const routerContext = {
      staticContext: {},
    };
    const wrapper = shallow(<Error404 />, { context: { router: routerContext } });
    expect(wrapper).toMatchSnapshot();
    expect(routerContext.staticContext.missed).toBeTruthy();
  });
});
