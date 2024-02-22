import React, { useEffect, useState } from 'react';
import './me-tab.css';

const TAB_OPTIONS = [{
  name: 'First Page',
  id: 'first-tab',
  component: <h3>This is the first</h3>
}, {
  name: 'Second Page',
  id: 'second-tab',
  component: <h3>This is the second page</h3>
}];
const METab = ({
  defaultTab,
  tabs = TAB_OPTIONS,
  contentStyle,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState();

  useEffect(() => {
    let found = findTabWithId(defaultTab);
    if (!found) found = tabs[0];
    setActiveTab(found);
  }, [defaultTab, tabs]);

  const findTabWithId = (id) => {
    return tabs.find(tab => tab.id === id);
  };
  const isActive = (key) => {
    return key === activeTab?.id;
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    onChange && onChange(tab);
  };

  const renderComponent = (activeTab) => {
    const {
      component,
      renderComponent
    } = activeTab || {};
    if (renderComponent) return renderComponent();

    return component;
  };

  return (
    <div>
      <div className="root-easy-tab">
        <div>
          {tabs?.map((tab, index) => {
            const classes = `c-tab-item ${isActive(tab.id) ? 'c-tab-header-selected' : 'c-tab-item'}`;
            return (
              <div onClick={() => changeTab(tab)} className={classes} key={index}>
                <p>{tab.name}</p>
              </div>
            );
          })}
        </div>
        <div style={contentStyle || {}}>
          {renderComponent(activeTab)}
        </div>
      </div>
    </div>);
};

export default METab;