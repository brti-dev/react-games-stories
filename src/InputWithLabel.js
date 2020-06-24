import React from 'react'

// CSS
// import styles from './App.module.css';
// import cs from 'classnames'; 
// import styled from 'styled-components'; // CSS in JS

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

    const { id, type = 'text', children, value, onInputChange, numResults, isFocused } = props

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

export default InputWithLabel
