/* eslint import/first: "off" */
import '../../shared/polyfills';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
