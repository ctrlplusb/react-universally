import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  // include home and about route in same chunk e.g main
  resolve: () => import(/* webpackChunkName: "main" */ './AboutRoute'),
});
