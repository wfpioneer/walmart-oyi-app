import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import { PrintQueueScreen } from './PrintQueueScreen';
import { validateSession } from '../../utils/sessionTimeout';

export const PrintQueue = () => {
  const { printQueue, selectedPrinter } = useTypedSelector(state => state.Print);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [itemIndexToEdit, setItemIndexToEdit] = useState(-1);
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState({ error: false, message: '' });
  const [apiStart, setApiStart] = useState(0);

  const trackEventCall = (eventName: string, params: any) => {
    trackEvent(eventName, params);
  };
  return (
    <PrintQueueScreen
      printQueue={printQueue}
      selectedPrinter={selectedPrinter}
      printAPI={printAPI}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      itemIndexToEdit={itemIndexToEdit}
      setItemIndexToEdit={setItemIndexToEdit}
      apiInProgress={apiInProgress}
      setAPIInProgress={setAPIInProgress}
      error={error}
      setError={setError}
      apiStart={apiStart}
      setApiStart={setApiStart}
      trackEventCall={trackEventCall}
      validateSession={validateSession}
    />
  );
};

export default PrintQueue;
