import { Component } from 'react';
import './ErrorButton.css';

class ErrorButton extends Component {
  render() {
    return (
      <button className="error-button">
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;