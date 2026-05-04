import { Component } from 'react';
import Search from './components/Search/Search';
import Results from './components/Results/Results';
import ErrorButton from './components/ErrorButton/ErrorButton';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Search />
        <Results />
        <ErrorButton />
      </div>
    );
  }
}

export default App;