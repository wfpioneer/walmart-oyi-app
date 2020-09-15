import React, { createRef, RefObject } from 'react';
import { View, TextInput } from 'react-native';
import styles from './EnterLocation.style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from '../buttons/IconButton';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales'
import { useDispatch } from 'react-redux';

const EnterLocation = (props:{enterLocation:boolean, setEnterLocation:Function}) => {
    const dispatch = useDispatch();
    const [value, onChangeText] = React.useState('');
    const textInputRef: RefObject<TextInput> = createRef();

    const onSubmit = (text: string) => {
        if(value.length > 3) {
            console.log("This will be a dispatch.")
        };
        props.setEnterLocation(false);
    }
    
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
                        onChangeText={(text: string) => onChangeText(text)}
                        selectionColor={COLOR.MAIN_THEME_COLOR}
                        placeholder={strings('GENERICS.INPUT_LOC')}
                        keyboardType='default'
                    />
                </View>
                <Button
                title={strings('GENERICS.SUBMIT')}
                type={Button.Type.PRIMARY}
                style={{width: '100%'}}
                onPress={onSubmit}
                disabled={value.length<4}
                />
            </View>
        </View>
    )
}

export default EnterLocation;