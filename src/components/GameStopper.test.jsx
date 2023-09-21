import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import GameStopper from './GameStopper';
import renderer from 'react-test-renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });

const createGameStopperJSON = () => renderer.create(<GameStopper />).toJSON();
const createGameStopperWrapper = () => shallow(<GameStopper />);

describe('GameStopper', () => {
  let step1, step2;

  beforeEach(() => {
    step1 = createGameStopperJSON();
    step2 = createGameStopperWrapper();
  });

  it('The game stopper component should be rendered', () => {
    expect(step2).toHaveLength(1);
    expect(step1).toMatchSnapshot();
  });

  it('Can see the wanna check string', () => {
    const text = step2.find('h4');
    expect(text.text()).toBe('Wanna check the results?');
    expect(step1).toMatchSnapshot();
  });

  it('Can see the button of yeah', () => {
    const text = step2.find('#yes-click');
    expect(text.text()).toBe('Yeah');
    expect(step1).toMatchSnapshot();
  });

  it('Can see the button of Nah', () => {
    const text = step2.find('#Nah-btn');
    expect(text.text()).toBe('Nah');
    expect(step1).toMatchSnapshot();
  });
});
