import React from 'react';
// import logo from './logo.svg';
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
  const games = [
   {
     objectID: 1,
      title: 'Super Mario Bros.',
      year_published: 1985,
   }, {
     objectID:2,
     title: "Super Mario World", 
     year_published: 1990,
   }, {
     objectID: 3,
     title: "Mario Bros.", 
     year_published: 1984,
   }, {
     objectID: 4,
     title: "The Legend of Zelda",
     year_published: 1985,
   }, {
     objectID: 5,
     title: "Metroid",
     year_published: 1987,
   }, {
     objectID: 6,
     title: "Mega Man 2",
     year_published: 1988,
   }, {
     objectID: 7,
     title: 'Tetris',
     year_published: 1989,
   }
  ];
  
  // Uses useState to preserve the variables between function calls, get variable from local storage
  // Uses useEffect to save variables to local storage when they change
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'Search all the things')
  
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

  const searchGames = games.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const searchNum = searchGames.length;

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
      <h1>My Games</h1>

      <p>
        <button onClick={handleCount}>Counter++</button>
      </p>

      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearch} numResults={searchNum} />

      {/* Use props to send variables from App component to List component */}
      <List list={searchGames} />
    </>
  );
}

/**
 * InputWithLabel component
 * @param {String} id 
 * @param {String} type Input type form field
 * @param {String} label
 * @param {String} value The search term
 * @param {Event} onInputChange
 */
function InputWithLabel(props) {
  console.log('InputWithLabel component', 'props:', props)

  const {id, type='text', label, value, onInputChange, numResults} = props

  return (
    <>
      <fieldset>
        <label htmlFor={id}>{label}</label>
        {/* callback directly to props 
            By adding React value, it becomes a controlled component */}
        <input id={id} type={type} value={value} onChange={onInputChange} />
      </fieldset>

      <p>Searching for <em>{value}</em> | <b>{numResults || 'No'}</b> results</p>
    </>
  )

}

/**
 * List component
 * @param {Object} props.list Games object defined in App component
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
        <dd>{item.title}</dd>
        <dt>Release</dt>
        <dd>{item.year_published}</dd>
      </dl>
  )
}

export default App;
