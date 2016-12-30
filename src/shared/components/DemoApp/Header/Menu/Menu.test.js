/* @flow */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';

describe('<Home />', () => {
  test('renders', () => {
    const wrapper = shallow(<Menu />);
    expect(wrapper).toMatchSnapshot();
  });
});
