import React, { RefObject, useRef, useState } from 'react';
import { View, TextInput } from 'react-native';
import styles from './EnterLocation.style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from '../buttons/IconButton';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales'

const EnterLocation = (props:{enterLocation:boolean, setEnterLocation:Function, loc:string, setLoc:Function, onSubmit:Function}) => {
    const [value, setValue] = useState('');

    const textInputRef: RefObject<TextInput> = useRef(null);
    
    return (
        <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.closeContainer}>
                    <IconButton
                        icon={<MaterialCommunityIcon name={'close'} size={16} color={COLOR.GREY_500} />}
                        type={Button.Type.NO_BORDER}
                        onPress={() => props.setEnterLocation(false)}
                    />
                </View>
                <View style={styles.scanContainer}>
                    <TextInput
                        ref={textInputRef}
                        style={styles.textInput}
                        value={value}
                        onChangeText={(text: string) => setValue(text)}
                        selectionColor={COLOR.MAIN_THEME_COLOR}
                        placeholder={strings('GENERICS.INPUT_LOC')}
                        keyboardType='default'
                    />
                </View>
                <Button
                title={strings('GENERICS.OK')}
                type={Button.Type.PRIMARY}
                style={{width: '100%'}}
                onPress={() => props.onSubmit(value.toUpperCase())}
                disabled={value.length<4}
                />
            </View>
        </View>
    )
};

export default EnterLocation;