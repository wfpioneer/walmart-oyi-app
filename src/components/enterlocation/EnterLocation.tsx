import React, { createRef, RefObject } from 'react';
import { View, TextInput } from 'react-native';
import styles from './EnterLocation.style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from '../buttons/IconButton';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales'
import { useDispatch } from 'react-redux';

const EnterLocation = (props:any) => {
    const dispatch = useDispatch();
    const [value, onChangeText] = React.useState('');
    const textInputRef: RefObject<TextInput> = createRef();

    const onSubmit = (text: string) => {
        if(text.length > 0) {
            console.log("This will be a dispatch.")
        }
    }
    
    return (
        <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.closeContainer}>
                    <IconButton
                        icon={<MaterialCommunityIcon name={'close'} size={16} color={COLOR.GREY_500} />}
                        type={Button.Type.NO_BORDER}
                        onPress={() => console.log("TODO - close button pressed.")}
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
                        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
                        keyboardType={props.keyboardType || 'default'}
                    />
                </View>
                <Button
                title={strings('GENERICS.SUBMIT')}
                type={Button.Type.PRIMARY}
                style={{width: '100%'}}
                onPress={console.log("This button will submit the payload.")}
                disabled={console.log("This will occur if there isn't any content in the location text input.")}
                />
            </View>
        </View>
    )
}

export default EnterLocation;