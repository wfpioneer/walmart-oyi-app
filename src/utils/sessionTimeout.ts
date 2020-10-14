// @ts-ignore
import WMSSO from 'react-native-wmsso';
import { logoutUser } from '../state/actions/User';
import { store } from '../../App';
import moment, { duration } from 'moment';
import { trackEvent } from '../utils/AppCenterTool';
import { clearEndTime, setEndTime } from '../state/actions/SessionTimeout';

const sessionLength=2;
export const sessionEnd = () => {
    let endTime=moment();
    return endTime.add(sessionLength, 'hours');
}

export function validateSession(navigation: any): (void) {
    const currentTime=moment();
    const endTime=store.getState().SessionTimeout;
    const diff=moment.duration(currentTime.diff(endTime));
    if (diff.get('seconds')>0) {
        trackEvent('user_sign_out');
        clearEndTime();
        WMSSO.signOutUser().then(() => {
            navigation.replace('Login');
            logoutUser();
        })
    };
}