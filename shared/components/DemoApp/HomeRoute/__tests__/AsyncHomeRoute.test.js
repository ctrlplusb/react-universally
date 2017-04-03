/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';

import AsyncHomeRoute from '../AsyncHomeRoute';

describe('<AsyncHomeRoute />', () => {
  test('renders', () => {
    const wrapper = shallow(<AsyncHomeRoute />);
    expect(wrapper).toMatchSnapshot();
  });
});
