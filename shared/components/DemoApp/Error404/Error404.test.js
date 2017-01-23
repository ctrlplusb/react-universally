/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { shallow } from 'enzyme';
import Error404 from './Error404';

describe('<Error404 />', () => {
  test('renders', () => {
    const wrapper = shallow(<Error404 />);
    expect(wrapper).toMatchSnapshot();
  });
});
