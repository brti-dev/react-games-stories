import React from 'react';
import logo from './logo.svg';
import './App.css';


const App = () => {
  const stories = [
   {
      title: 'React',
      url: 'https://reactjs.org/', 
      author: 'Jordan Walke', 
      num_comments: 3,
      points: 4,
      objectID: 0,
    }, {
      title: 'Redux',
      url: 'https://redux.js.org/', 
      author: 'Dan Abramov, Andrew Clark', 
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  // useState hook takes initial state as argument, then returns two values
  // ret[0] = current state
  // ret[1] = function to update state
  const [searchTerm, setSearchTerm] = React.useState('nothing yet')

  /**
   * Handle oneChange of search field
   * When field changes, access function to update state via useState
   * @param {Event} event onChange event object
   */
  const handleChange = event => {
    setSearchTerm(event.target.value)
    console.log(event.timeStamp, event.target.value, event.type);
  }

  const handleChangeKey = event => {
    console.log(event.key)
  }

  const [count, setCount] = React.useState(0);

  const handleCount = event => {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <img src={logo} className="App-logo" alt="logo" />

      <fieldset>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={handleChange} onKeyDown={handleChangeKey} />
        <button onClick={handleCount}>+1</button> <span>{count}</span>
      </fieldset>

      <p>Searching for <em>{searchTerm}</em></p>

      <hr />

      {/* Use props to send variables from App component to List component */}
      <List list={stories} />
    </div>
  );
}

/**
 * List component
 * @param {*} props Stories object defined in App component
 */
const List = props => {
  return props.list.map(item => 
      <dl key={item.objectID}>
        <dt>Title</dt>
        <dd><a href={item.url}>{item.title}</a></dd>
        <dt>Author</dt>
        <dd>{item.author.includes(",") ? item.author.split(', ').join(' and ') : item.author}</dd>
      </dl>
  )
}

export default App;
