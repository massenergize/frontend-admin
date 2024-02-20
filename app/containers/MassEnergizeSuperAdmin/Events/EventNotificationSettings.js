import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../../utils/messenger';
import notification from '../../../components/Notification/Notification';
import { findItemAtIndexAndRemainder } from '../../../utils/common';
import { loadAllEvents } from '../../../redux/redux-actions/adminActions';


const OPTIONS = [{
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
export default function EventNotificationSettings({
  name,
  settings,
  id,
  close
}) {
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

  return (<div style={{ padding: '0px 20px' }}>
    <p>Notification settings for <b>"{name}"</b></p>
    {OPTIONS.map((t) => <> <FormControlLabel
      key={t.key}
      control={<Checkbox checked={getValue(t.key)} onChange={handleChange} name={t.key}/>}
      label={t.name}
      value={t.key}
    /> <br/>
    </>)}
    <div style={{
      padding: 20,
      display: 'flex',
      flexDirection: 'row'
    }}
    >
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
