import React from 'react';
import { observable } from 'mobx';
import { renderIntoDocument, Simulate } from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import App from 'components/app.js';

describe('App', () => {
  let store;

  beforeEach(() => {
    store = observable({
      todos: [],
      addTodo: jasmine.createSpy()
    });
  });

  it('is an observer of todos', () => {
    const component = renderIntoDocument(<App store={store}/>);
    const domElement = findDOMNode(component);

    const items = () => {
      return domElement.querySelectorAll('[data-test="item"]');
    };

    expect(items().length).toEqual(0);

    component.props.store.todos = ['item'];

    const itemText = _.map(items(), (item) => {
      return item.textContent;
    });
    expect(itemText).toEqual(['item']);
  });

  it('displays the list of todos from the store prop', () => {
    store.todos = ['first item', 'second item'];
    const component = renderIntoDocument(<App store={store}/>);
    const domElement = findDOMNode(component);

    const items = domElement.querySelectorAll('[data-test="item"]');
    const itemText = _.map(items, (item) => {
      return item.textContent;
    });
    expect(itemText).toEqual(['first item', 'second item']);
  });

  describe('when add item is pressed', () => {
    it('calls addTodo on its store prop, passing in the input value', () => {
      const component = renderIntoDocument(<App store={store}/>);
      const domElement = findDOMNode(component);
      const inputField = domElement.querySelector('[data-test="item-field"]');

      inputField.value = 'Get rice';
      Simulate.change(inputField);
      Simulate.submit(domElement.querySelector('[data-test="item-form"]'));

      expect(store.addTodo).toHaveBeenCalledWith('Get rice');
    });
  });
});
