import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import GameStarter from './GameStarter';
import renderer from 'react-test-renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });

const createGameStarterJSON = () => renderer.create(<GameStarter />).toJSON();
const createGameStarterWrapper = () => shallow(<GameStarter />);

describe('GameStarter', () => {
  let step1, step2;

  beforeEach(() => {
    step1 = createGameStarterJSON();
    step2 = createGameStarterWrapper();
  });

  it('The game starter component should be rendered', () => {
    expect(step2).toHaveLength(1);
    expect(step1).toMatchSnapshot();
  });

  it('Can see the session if string', () => {
    const text = step2.find('#session-id');
    expect(text.text()).toBe('The Session ID is');
    expect(step1).toMatchSnapshot();
  });

  it('Can see the button of copy', () => {
    const text = step2.find('#copy-to-clipboard');
    expect(text.text()).toBe('Copy The Session ID To Clipboard');
    expect(step1).toMatchSnapshot();
  });

  it('Can see the button of join', () => {
    const text = step2.find('#btn-to-join');
    expect(text.text()).toBe('Click to Join The Game');
    expect(step1).toMatchSnapshot();
  });

  it('an see the button of close', () => {
    const text = step2.find('#btn-to-close');
    expect(text.text()).toBe('Close');
    expect(step1).toMatchSnapshot();
  });
});
