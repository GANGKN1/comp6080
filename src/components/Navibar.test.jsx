import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import NaviBar from './NaviBar';
import renderer from 'react-test-renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { BrowserRouter as Router } from 'react-router-dom';
Enzyme.configure({ adapter: new Adapter() });

describe('NaviBar', () => {
  const createNaviBar = () => renderer.create(<Router><NaviBar /></Router>).toJSON();
  const shallowNaviBar = () => shallow(<NaviBar />);

  it('There is a BigBrain Title', () => {
    const step1 = createNaviBar();
    const step2 = shallowNaviBar();
    const text = step2.find('#bigbrain-title');

    expect(step2).toHaveLength(1);
    expect(text).toHaveLength(1);
    expect(text.text()).toBe('BigBrain');
    expect(step1).toMatchSnapshot();
  });

  it('There is a dashboard button for clicking', () => {
    const step1 = createNaviBar();
    const step2 = shallowNaviBar();
    const text = step2.find('#bigbrain-dashboard');

    expect(text.text()).toBe('Dashboard');
    expect(step1).toMatchSnapshot();
  });

  it('There is a logout button for clicking', () => {
    const step1 = createNaviBar();
    const step2 = shallowNaviBar();
    const text = step2.find('#bigbrain-logout');

    expect(text.text()).toBe('Log Out');
    expect(step1).toMatchSnapshot();
  });
});
