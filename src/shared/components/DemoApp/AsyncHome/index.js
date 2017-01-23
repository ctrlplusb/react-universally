import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./Home'),
  ssrMode: 'boundary',
  name: 'AsyncHome',
});
