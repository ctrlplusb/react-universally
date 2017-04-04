import React, { Component } from 'react';

class CounterRoute extends Component {
  constructor(props) {
    super(props);
    this.incrementCounter = this.incrementCounter.bind(this);
    this.state = { counter: 0 };
  }

  incrementCounter() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div>
        <h3>Counter</h3>
        <p>
          <em>
            This is a small demo component that contains state.  It's useful for
            testing the hot reloading experience of an asyncComponent.
          </em>
        </p>
        <p>
          Current value: {this.state.counter}
        </p>
        <p>
          <button onClick={this.incrementCounter}>Increment</button>
        </p>
      </div>
    );
  }
}

export default CounterRoute;
