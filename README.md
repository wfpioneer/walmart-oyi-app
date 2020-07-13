# react-native-skeleton
This is a barebones app that contains everything you need to jumpstart development on your own app.

### What this does
You can login and go to a home screen. That's pretty much it.

Really, the point of this app is to provide you the infrastructure and eliminate the setup that you normally have to go through
to set up many React Native apps.

### What this contains
* `react-navigation` version 5
* `react-native-localize` for your localization pleasure
* `redux` for your state management
* `react-native-wmsso` to handle Walmart associate logins
* `react-native-wm-barcode` to handle barcode scanning on devices [(docs)](https://gecgithub01.walmart.com/Store-Mobility-Services/wm-barcode-scanner/tree/master/react)

### To run the app
* Clone the repo
* Run `npm install`
* For iOS run `cd ios && pod install`
* Run `npx react-native link`
* Open up Android Studio/Xcode
* Hit play

### How the app is structured
* components
  * Button, textinput, title (all "stolen" from US apps)
* locales
  * Holds your localized strings
* models
  * Holds your typescript models
* navigators
  * Holds your stack and tab navigators to link your screens together
* screens
  * Holds your UI and connects your screens to redux
* state
  * All the redux actions/reducers
* themes
  * Contains color values

### How to emulate a barcode scan
1. In your debugger console: `window.mockScan('value', 'type')`

### How to set up an API call
1. Create your saga action in `state/actions/saga.ts`
2. Create your API action in `state/actions/asyncAPI.ts`
3. Add to the `asyncReducer` object in `state/reducers/asyncAPI.ts` the following  
    ```
    apiName: makeAsyncReducer(asyncActions.API_ACTION_NAME_HERE)
    ```  
4. Create a service in `services`. Model the file after the following:  
    ```
    export default class HitGoogleService {
      public static serviceName(payload) {
        return Request.enqueue({
          url: 'https://www.example.com',
          method: 'get',
          timeout: 3000
        });
      }
    }
    ```
    You can also insert the payload as a `body` for POST requests, and you can also insert custom headers as desired here.
    When providing a payload, any payload that is passed into the saga action will be passed into the first argument in this function.
5. In `state/sagas/index.ts`, add the following to the `genericSagas` array:
    ```
    makeAsyncSaga(saga.SAGA_ACTION_HERE, actions.api_action_here, api_service_here)
    ```
6. Call the saga action in code where you want the API call to be made
    * You have to use a redux connected screen or component here, and dispatch the saga action
    * Example:
    ```
   const mapDispatchToProps = {
        hitGoogle
   };
   
   ...
   
   render() {
        <Button
           title="Ping Google"
           onPress={() => this.props.hitGoogle({ stuff: 'test payload' })}
         />
   }
   ```

