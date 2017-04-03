/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import AsyncAboutRoute from '../AsyncAboutRoute';

describe('<AsyncAboutRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<AsyncAboutRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
