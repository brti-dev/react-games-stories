import React from 'react'

// CSS
// import styles from './App.module.css';
// import cs from 'classnames'; 
// import styled from 'styled-components'; // CSS in JS

/**
 * SortField component
 * @prop {String} sortBy 'title' | 'year_published'
 * @prop {Event} onSortBy Callback
 */
function SortField(props) {
    console.log('SortField component', props)

    const { sortBy, onSortBy } = props
    
    return (
        <>
            Sort by
            <label>
                <input type="radio" name="sort" value="title" onChange={onSortBy} checked={sortBy === 'title'} /> Title
            </label>
            <label>
                <input type="radio" name="sort" value="year_published" onChange={onSortBy} checked={sortBy === 'year_published'} /> Release
            </label>
        </>
    )
}

/**
 * SearchForm component
 * @prop {String} value The search term
 * @prop {Event} onInputChange
 * @prop {Number} numResults Number of results after list is filtered
 * @prop {Boolean} isFocused Reference to the input field's focus
 * @prop {Event} onSearchSubmit
 * @prop {String} children Inner HTML of the component
 */
function SearchForm(props) {
    console.log('SearchForm component', 'props:', props)

    const { value, onInputChange, numResults, isFocused, onSearchSubmit, children, } = props

    console.log()

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
        <form onSubmit={onSearchSubmit}>
            <fieldset>
                <label>Search</label>
                {/* Callback directly to props 
              By adding React value, it becomes a controlled component
              Access the reserved ref field */}
                <input ref={inputRef} type="text" value={value} onChange={onInputChange} /> 
                { children }
                <button type="submit">Search</button>
            </fieldset>

            <p>Searching for <em>{value}</em> | <b>{numResults || 'No'}</b> results</p>
        </form>
    )
}

export { SearchForm, SortField }
