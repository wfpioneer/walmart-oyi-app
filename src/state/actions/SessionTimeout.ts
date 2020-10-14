export const setEndTime = (sessionEnd: any) => ({
    type: 'SESSION/ENDTIME',
    payload: sessionEnd
});

export const clearEndTime = () => ({
    type: 'SESSION/CLEAR'
})