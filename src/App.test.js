import React from 'react'
import renderer from 'react-test-renderer'

import App, { List, SearchForm, Item, initialGames, } from './App'

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
    expect('team'.includes('I')).toBe(false)
    expect('team'.includes('I')).not.toBeTruthy()
});

describe('something truthy', () => {
    it('true to be true', () => {
        expect(true).toBe(true);
    });
});

describe('Item', () => {
    const item = {
        title: 'Maniac Mansion',
        year_published: 1989,
        objectID: 101,
    }
    const handleRemoveItem = jest.fn() //@returns a mock of real function

    let component
    let instance
    let tree

    beforeEach(() => {
        component = renderer.create(<Item item={item} onRemoveItem={handleRemoveItem} />)
        instance = component.root //Useful for making assertions about specific nodes in the tree
        tree = component.toJSON()
    })

    it ('renders all properties', () => {
        expect(tree.type).toEqual('div')
        expect(tree.children[0].type).toEqual('dl')

        expect (instance.findByType('a').props.href).toEqual('/link/101')

        expect(
            instance.findAllByProps({ children: 1989 }).length
        ).toEqual(2)
    })

    it ('calls onRemoveItem on button click', () => {
        instance.findByType('button').props.onClick() //execute click?

        expect(handleRemoveItem).toHaveBeenCalledTimes(1)
        expect(handleRemoveItem).toHaveBeenCalledWith(item) //@param what arguments are passed to the mock function
    })
    
    test('renders snapshot', () => {
        expect(tree).toMatchSnapshot()
    })
})

describe('List', () => {
    const component = renderer.create(<List list={initialGames} />)
    let tree = component.toJSON()

    it('renders a few items', () => {
        expect(component.root.findAllByType(Item).length).toEqual(initialGames.length)
    })

    test('renders snapshot', () => {
        expect(tree).toMatchSnapshot()
    })
})

describe('SearchForm', () => {
    const SearchFormProps = {
        id: 'search',
        value: 'mar',
        onInputChange: jest.fn(), //mock function
    }
    
    const component = renderer.create(<SearchForm {...SearchFormProps} />)
    const instance = component.root
    let tree = component.toJSON()

    it('renders input field with value', () => {
        expect(instance.findByType('input').props.type).toEqual('text')
        expect(instance.findByType('input').props.value).toEqual('mar')
    })

    it('changes input field', () => {
        const pseudoEvent = {target: 'mario'}

        instance.findByType('input').props.onChange(pseudoEvent)

        expect(SearchFormProps.onInputChange).toHaveBeenCalledTimes(1)
        expect(SearchFormProps.onInputChange).toHaveBeenCalledWith(pseudoEvent)
    })

    test('renders snapshot', () => {
        expect(tree).toMatchSnapshot()
    })
})