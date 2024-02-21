import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../../../utils/messenger';
import notification from '../../../../components/Notification/Notification';
import { findItemAtIndexAndRemainder } from '../../../../utils/common';
import { loadAllEvents } from '../../../../redux/redux-actions/adminActions';
import METab from '../../ME  Tools/me-tabbed-view/METab';
import NotificationChoices from './NotificationChoices';
import SavedNudgeSettings from './SavedNudgeSettings';


export const OPTIONS = [{
  key: 'when_first_uploaded',
  name: 'Notify on first nudge after event is posted or shared',
  value: false
}, // { key: "when_first_uploaded", name: "Push" },
  {
    key: 'within_30_days',
    name: 'Notify with nudge within 30 days of event',
    value: true
  }, {
    key: 'within_1_week',
    name: 'Notify with nudge within 1 week of event',
    value: true
  }, {
    key: 'never',
    name: 'No notifications for this event',
    value: false
  },];

const INITIAL_STATE = OPTIONS.reduce((acc, t) => ({
  ...acc,
  [t.key]: t.value
}), {});
export default function EventNotificationSettings(props) {
  const {
    settings,
    id,
    close
  } = props || {};

  // const [tabs, setTabs] = useState([]);
  const [state, setState] = useState({
    ...settings || {},
    notifications: settings?.notifications || INITIAL_STATE
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const allEvents = useSelector(state => state.getIn(['allEvents']));

  const getValue = (name) => {
    const data = state?.notifications || {};
    return data[name];
  };

  const resetOptions = () => {
    const data = state?.notifications || {};

    return Object.fromEntries(Object.entries(data)
      .filter(([key]) => key !== 'never')
      .map(([key]) => [key, false]));
  };

  const updateNotification = (name, value) => {
    const notifications = state.notifications || {};
    setState({
      ...state,
      notifications: {
        ...notifications,
        [name]: value,
        never: false
      }

    });
  };

  const handleChange = (event) => {
    const { name } = event.target;
    if (name === 'never' && event.target.checked) {
      const remainder = resetOptions();
      return setState({
        ...state,
        notifications: {
          ...remainder,
          never: true
        }
      });
    }
    // "Never" never really gets to use this function
    updateNotification(name, event.target.checked);
  };

  const sendChangesToBackend = () => {
    setLoading(true);
    apiCall('/events.update', {
      event_id: id,
      settings: JSON.stringify(state)
    })
      .then(response => {
        setLoading(false);
        if (!response.success) {
          return console.log('Error updating settings', response);
        }
        const event = response?.data;
        const {
          index,
          remainder
        } = findItemAtIndexAndRemainder(allEvents, (ev) => ev.id === event?.id);
        const updatedEvents = [...remainder];
        updatedEvents.splice(index, 0, event);
        dispatch(loadAllEvents(updatedEvents));
      })
      .catch(err => {
        setLoading(false);
        console.log('Error updating settings', err);
      });
  };
  //
  // useEffect(() => {
  //
  //   const tabs = [{
  //     name: 'Nudge Settings',
  //     id: 'nudge-settings',
  //     renderComponent: () => <NotificationChoices handleChange={handleChange} event={props} getValue={getValue}/>
  //     // component : <NotificationChoices handleChange={handleChange} event={props} getValue={getValue}/>
  //   }, {
  //     name: 'Saved Settings',
  //     id: 'saved-settings',
  //     renderComponent: () => <SavedNudgeSettings event={props}/>
  //     // component : <SavedNudgeSettings event={props}/>
  //   }];
  //   setTabs(tabs);
  //
  // }, [state]);
  const tabs = [{
    name: 'Nudge Settings',
    id: 'nudge-settings',
    renderComponent: () => <NotificationChoices handleChange={handleChange} event={props} getValue={getValue}/>
    // component : <NotificationChoices handleChange={handleChange} event={props} getValue={getValue}/>
  }, {
    name: 'Saved Settings',
    id: 'saved-settings',
    renderComponent: () => <SavedNudgeSettings event={props}/>
    // component : <SavedNudgeSettings event={props}/>
  }];


  return (<div style={{

    width: '38vw',
    maxHeight: 440,
    height: 440,
  }}>
    <div style={{ padding: '0px 20px', }}>
      <METab tabs={tabs}/>
    </div>

    <div style={{
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding:"10px 20px"
    }}>
      <div style={{ marginLeft: 'auto' }}>
        <Button onClick={() => close && close()}>Close</Button>
        <Button onClick={() => sendChangesToBackend()}>{loading && <i
          className="fa fa-spinner fa-spin"
          style={{ marginRight: 10 }}
        />} {loading ? '' : 'Apply'}
        </Button>
      </div>
    </div>

  </div>);
}
