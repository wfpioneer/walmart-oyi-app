import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { trackEvent } from '../../utils/AppCenterTool';
import {useTypedSelector} from '../../state/reducers/RootReducer';

interface AddPalletScreenProps {
  palletId: string;
  updatePalletId: React.Dispatch<React.SetStateAction<string>>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  section: { id: number; name: string; }
}

const AddPalletScreen = (props: AddPalletScreenProps) => {
  const { palletId, updatePalletId, dispatch, navigation, section } = props;

  return (
    <View>

    </View>
  )
};

const AddPallet = () => {
  const [palletId, updatePalletId] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const section = useTypedSelector(state => state.Location.selectedSection);

  return (
    <AddPalletScreen
      palletId={palletId}
      updatePalletId={updatePalletId}
      dispatch={dispatch}
      navigation={navigation}
      section={section}/>
  )
};

export default AddPallet;