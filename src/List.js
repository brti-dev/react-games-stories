import React from 'react'

// CSS
import styles from './App.module.css';
import cs from 'classnames'; 
import styled from 'styled-components'; // CSS in JS

// Images
import { ReactComponent as Check } from './check.svg';

// Create a memo to prevent re-rendering if props don't change
const List = React.memo(({ list, onRemoveItem }) => {
    console.log('List component', 'props.list:', list)
    return list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)
});

let StyledDL = styled.dl`
    display: flex;
  `
let StyledDT = styled.dt`
    flex-basis: 25%;
    font-weight: bold;
    text-align: right;
    margin: 0;
    padding: 0 1em 0 0;
  `
let StyledDD = styled.dd`
    flex-basis: 25%;
    margin: 0;
    padding: 0;
    background-color: ${props => props.backgroundColor};
    color: white;
  `

/**
 * Item component
 * @param {Object} props.item Item object
 * @param {} onRemoveItem
 */
const Item = props => {
    console.log('Item component', 'props:', props)
    const { item, onRemoveItem } = props

    let buttonClass = cs(styles.button, styles.buttony)
    let link = '/link/' + item.objectID

    return (
        <div className={styles.item}>
            <StyledDL key={item.objectID}>
                <StyledDT>Title</StyledDT>
                <StyledDD backgroundColor="gray"><a href={link}>{item.title}</a></StyledDD>
                <StyledDT>Release</StyledDT>
                <StyledDD backgroundColor="black">{item.year_published}</StyledDD>
            </StyledDL>
            <button type="button" onClick={() => onRemoveItem(item)} className={buttonClass}><Check height="18px" width="18px" /></button>
        </div>
    )
}

export { List, Item }
