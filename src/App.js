import React from 'react';
// import logo from './logo.svg';
import './App.css';
      
const initialGames = [
  {
    objectID: 1,
    title: 'Super Mario Bros.',
    year_published: 1985,
  }, {
    objectID: 2,
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

// /**
//  * function for useReducer hook
//  * @param {*} state ?????????
//  * @param {String} action.type Describes the action; Only one type `SET_GAMES` is supported here
//  * @returns {Function} New state based on state and action args
//  */
// function gamesReducer(state, action) {
//   // Only one type is supported
//   if (action.type == 'SET_GAMES') {
//     return action.payload
//   } else {
//     throw new Error()
//   }
// }

function getAsyncronousGames() {
  return new Promise((resolve, reject) => 
    // Emulate an HTTP request
    setTimeout(
      () => resolve({ data: { games: initialGames }}), 
      // reject,
      2000
    )
  )
}

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
  
  // Use useState to preserve the variables between function calls, get variable from local storage
  // Use useEffect to save variables to local storage when they change

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

  // Merge games list, loading, error states into Reducer
  const initialState = { data: [], isLoading: false, isError: false }
  const reducer = (state, action) => {
    // Return a new state based on given action
    console.log('Games Reducer', state, action)
    switch (action.type) {
      case 'GAMES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        }
      case 'GAMES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        }
        case 'GAMES_FETCH_FAIL':
          return {
            ...state,
            isLoading: false,
            isError: true,
          }
      case 'REMOVE_GAME':
        return {
          ...state,
          data: state.data.filter(
            game => action.payload.objectID !== game.objectID
          ),
        }
      default:
        throw new Error()
    }
  }
  const [games, dispatchGames] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatchGames({type: 'GAMES_FETCH_INIT'})

    getAsyncronousGames()
    .then(result => {
      dispatchGames({
        type: 'GAMES_FETCH_SUCCESS',
        payload: result.data.games
      })
    })
      .catch(() => dispatchGames({ type: 'GAMES_FETCH_FAIL' }))
  }, []) // Empty dependency array, side-effect only runs once upon first render

  const handleRemoveGame = item => {
    dispatchGames({
      type: 'REMOVE_GAME',
      payload: item
    })
  }

  const searchGames = games.data.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* prop.children = 'Search' */}
      <InputWithLabel id="search" value={searchTerm} onInputChange={handleSearch} numResults={searchNum} isFocused>
        Search: 
      </InputWithLabel>

      {games.isError && <p>Something went wrong</p>}

      {games.isLoading ? (<p>Loading...</p>) : (
        <List list={searchGames} onRemoveItem={handleRemoveGame} />
      )}
    </>
  );
}

/**
 * InputWithLabel component
 * @param {String} id 
 * @param {String} type Input type form field
 * @param {String} value The search term
 * @param {Event} onInputChange
 * @param {Number} numResults Number of results after list is filtered
 * @param {String} children Inner HTML of the component
 * @param {Boolean} isFocused Reference to the input field's focus
 */
function InputWithLabel(props) {
  console.log('InputWithLabel component', 'props:', props)

  const {id, type='text', children, value, onInputChange, numResults, isFocused} = props
  
  // Create a reference to an element
  // This will later be assigned to the text input element so we can reference it elsewhere in the component
  // Reference is persistent value for lifetime of component
  const inputRef = React.useRef()

  // Opt into React’s lifecycle with useEffect Hook
  // Focus on input field when the component renders (or its dependencies change)
  React.useEffect(() => {
    console.log('useEffect:isFocused', isFocused, inputRef)
    // Access the ref.current property, a mounted text input element
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <fieldset>
        <label htmlFor={id}>{children}</label>
        {/* Callback directly to props 
            By adding React value, it becomes a controlled component
            Access the reserved ref field */}
        <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />
      </fieldset>

      <p>Searching for <em>{value}</em> | <b>{numResults || 'No'}</b> results</p>
    </>
  )

}

/**
 * List component
 * @param {Object} props.list Games object defined in App component
 * @param {Function??} ??????
 */
const List = ({list, onRemoveItem}) => {
  console.log('List component', 'props.list:', list)
  return list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)
}

/**
 * Item component
 * @param {Object} props.item Item object
 * @param {} onRemoveItem
 */
const Item = props => {
  console.log('Item component', 'props:', props)
  const {item, onRemoveItem} = props

  function handleRemoveItem() {
    onRemoveItem(item)
  }

  return (
    <>
      <dl key={item.objectID}>
        <dt>Title</dt>
        <dd>{item.title}</dd>
        <dt>Release</dt>
        <dd>{item.year_published}</dd>
      </dl>
      <div>
        {/* Inline handler replaces handleRemoveItem() */}
        <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
      </div>
    </>
  )
}

export default App;
