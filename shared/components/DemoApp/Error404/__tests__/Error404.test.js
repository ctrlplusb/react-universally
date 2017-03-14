/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import Error404 from '../index';

describe('<Error404 />', () => {
  test('renders', () => {
    const staticContext = {};
    const wrapper = shallow(<Error404 staticContext={staticContext} />);
    expect(wrapper).toMatchSnapshot();
    expect(staticContext.missed).toBeTruthy();
  });
});
