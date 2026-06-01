import { useState } from 'react';
import './ErrorButton.css';

function ErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleClick = () => {
    setShouldThrow(true);
  };

  if (shouldThrow) {
    throw new Error('Test error triggered by Error Button');
  }

  return (
    <button className="error-button" onClick={handleClick}>
      Throw Error
    </button>
  );
}

export default ErrorButton;