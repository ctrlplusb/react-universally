/* @flow */

import { Children, Component } from 'react';
import type { Location } from '../../../shared/universal/types/react-router';
import type { Dispatch, ThunkAction } from '../../../shared/universal/types/redux';
import type { ReactNode } from '../../../shared/universal/types/react';
import executeTasks from './executeTasks';

type Props = {
  location?: Location,
  dispatch: Dispatch<ThunkAction>,
  children: ReactNode,
};

class TaskRoutesExecutor extends Component {
  props: Props;

  componentWillMount() {
    if (this.props.location) {
      executeTasks(this.props.location, this.props.dispatch);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.location != null && nextProps.location !== this.props.location) {
      executeTasks(nextProps.location, nextProps.dispatch);
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default TaskRoutesExecutor;
