import { Component } from 'react';
import './ErrorButton.css';

interface ErrorButtonState {
  shouldThrow: boolean;
}

class ErrorButton extends Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);
    this.state = {
      shouldThrow: false,
    };
  }

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error triggered by Error Button');
    }

    return (
      <button className="error-button" onClick={this.handleClick}>
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;