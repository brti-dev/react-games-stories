import React from 'react'

// CSS
// import styles from './App.module.css';
// import cs from 'classnames'; 
// import styled from 'styled-components'; // CSS in JS

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
 * @param {String} value The search term
 * @param {Event} onInputChange
 * @param {Number} numResults Number of results after list is filtered
 * @param {String} children Inner HTML of the component
 * @param {Boolean} isFocused Reference to the input field's focus
 * @param {String} sortBy 'title' | 'year_published'
 * @param {Event} onSortBy Callback
 */
function SearchForm(props) {
    console.log('SearchForm component', 'props:', props)

    const { value, onInputChange, numResults, isFocused, children } = props

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
        <>
            <fieldset>
                <label>Search</label>
                {/* Callback directly to props 
              By adding React value, it becomes a controlled component
              Access the reserved ref field */}
                <input ref={inputRef} type="text" value={value} onChange={onInputChange} />
                { children }
            </fieldset>

            <p>Searching for <em>{value}</em> | <b>{numResults || 'No'}</b> results</p>
        </>
    )
}

export { SearchForm, SortField }
