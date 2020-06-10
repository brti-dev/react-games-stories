import React from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * An encapuslated custom hook
 * @param {string} key A key to define this instance so `value` is not overwritten
 * @param {string} initialState Default value for useState()
 */
function useSemiPersistentState(key, initialState) {
  /** 
   * useState hook: preserve variables between function calls, beyond function exit
   * @param {mixed} InitialState Takes initial state as argument, then returns two values:
   * @returns {Array} [current state, function to update state]
   */
  const [value, setvalue] = React.useState(
    // Preserve search query via useState + local storage
    // local storage side effect
    localStorage.getItem(key) || initialState
  )
    
  /**
   * useEffect hook allows opt-in to component lifecycle
   * @param function Where the side-effect occurs; Called initially and (if dependency variable exists) if dependency variables change
   * @param array Dependency variables; If one changes, the function is called
   */
  React.useEffect(() => {
    console.log('useEffect:searchValue')
    // update locally-stored search term whenever `value` changes
    localStorage.setItem(key, value)
  }, [value, key]) // Only re-run the effect if `key` and/or `value` changes

  return [value, setvalue]
}

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
  
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'Re')
  
  /**
   * A callback handler to be used in the Search component but calls back here
   * @param {Event} event onChange event
   */
  const handleSearch = event => {
    console.log('onSearch event triggered', event.target.value)
    let term = event.target.value
    // Update the state of searchTerm
    setSearchTerm(term)
  }

  const searchStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [count, setCount] = React.useState(
    Number(localStorage.getItem('count')) || 0
  )

  const handleCount = () => {
    setCount(count + 1)
    localStorage.setItem('count', count + 1)
  }

  // useEffect: Do something after render
  // React will remember this function ("effect") and call it after performing DOM updates
  React.useEffect(() => {
    console.log('useEffect:count')
    document.title = `You clicked ${count} times`
  }, [count]) // Only re-run the effect if count changes

  return (
    <>
      <h1>My Hacker Stories</h1>

      <img src={logo} className="App-logo" alt="logo" />

      <p>
        <button onClick={handleCount}>Counter++</button>
      </p>

      {/* Search component; Send callback function to component using onSearch event */}
      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      {/* Use props to send variables from App component to List component */}
      <List list={searchStories} />
    </>
  );
}

/**
 * Search component
 * @param {Object} props.onSearch Callback function to communicate with App component
 * @param {String} props.searchTerm The search term
 */
function Search(props) {
  console.log('Search component', 'props:', props)

  const {onSearch, searchTerm} = props

  return (
    <>
      <fieldset>
        <label htmlFor="search">Search: </label>
        {/* callback directly to props 
            By adding React value, it becomes a controlled component */}
        <input id="search" type="text" value={searchTerm} onChange={onSearch} />
      </fieldset>

      <p>Searching for <em>{searchTerm}</em></p>
    </>
  )

}

/**
 * List component
 * @param {Object} props.list Stories object defined in App component
 */
const List = ({list}) => {
  console.log('List component', 'props.list:', list)
  return list.map(item => <Item key={item.objectID} item={item} />)
}

/**
 * Item component
 * @param {Object} props.item Item object
 */
const Item = props => {
  console.log('Item component', 'props:', props)
  const {item} = props
  return (
      <dl key={item.objectID}>
        <dt>Title</dt>
        <dd><a href={item.url}>{item.title}</a></dd>
        <dt>Author</dt>
        <dd>{item.author.includes(",") ? item.author.split(', ').join(' and ') : item.author}</dd>
      </dl>
  )
}

export default App;
