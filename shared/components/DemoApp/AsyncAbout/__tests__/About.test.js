/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import About from '../About';

describe('<About />', () => {
  test('renders', () => {
    const wrapper = shallow(<About />);
    expect(wrapper).toMatchSnapshot();
  });
});
