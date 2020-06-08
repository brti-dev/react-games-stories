import React from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * App component
 */
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
  const BLANK_SEARCH_TERM = 'nothing yet'
  const [searchTerm, setSearchTerm] = React.useState(BLANK_SEARCH_TERM)
  
  /**
   * A callback handler to be used in the Search component but calls back here
   * @param {Event} event onChange event
   */
  const handleSearch = event => {
    console.log('onSearch event triggered', event.target.value)
    let term = event.target.value === '' ? BLANK_SEARCH_TERM : event.target.value
    setSearchTerm(term)
  }

  const searchStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <img src={logo} className="App-logo" alt="logo" />

      {/* Search component; Send callback function to component using onSearch event */}
      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      {/* Use props to send variables from App component to List component */}
      <List list={searchStories} />
    </div>
  );
}

/**
 * Search component
 * @param {Object} props.onSearch Callback function to communicate with App component
 * @param {String} props.searchTerm The search term
 */
const Search = props => {
  console.log('Search component', 'props:', props)

  return (
    <div>
      <fieldset>
        <label htmlFor="search">Search: </label>
        {/* callback directly to props 
            By adding React value, it becomes a controlled component */}
        <input id="search" type="text" value={props.searchTerm} onChange={props.onSearch} />
      </fieldset>

      <p>Searching for <em>{props.searchTerm}</em></p>
    </div>
  )

}

/**
 * List component
 * @param {Object} props.list Stories object defined in App component
 */
const List = props => {
  console.log('List component', 'props:', props)
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
