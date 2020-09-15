import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {useDispatch} from "react-redux";
import { RadioButton, Text } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import { COLOR } from '../../themes/Color';
import styles from './SelectLocationType.style';
import { strings } from '../../locales';
import Button from '../../components/buttons/Button';
import {toggleIsEditing} from "../../state/actions/Location";


const SelectLocationType = () => {
  const [type, setType] = React.useState('floor');
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const locProps = route.params ? route.params : {};

  const handleNext = () => {
    dispatch(toggleIsEditing());
    navigation.goBack();
  };

  console.log(locProps);

  return (
    <>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.typeListItem}>
          <RadioButton value="Sales Floor" status={type === 'floor' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('floor')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.FLOOR')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="Endcap" status={type === 'endcap' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('endcap')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.ENDCAP')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="Pod" status={type === 'pod' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('pod')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.POD')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value="display" status={type === 'display' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('display')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.DISPLAY')}</Text>
          </TouchableOpacity>
        </View>
      </RadioButton.Group>
      <View style={styles.container}>
        <Button title={strings('GENERICS.NEXT')} radius={0} onPress={handleNext} />
      </View>
    </>
  );
};

export default SelectLocationType;
