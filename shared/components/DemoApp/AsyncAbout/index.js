import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./About'),
  ssrMode: 'boundary',
  name: 'AsyncAbout',
});
