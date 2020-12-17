# OYI-Android
This is the Android version of OYI, currently only designed to be deployed on internal TC devices.

### Currently Supported Devices
- TC70
- TC70X

#### Future Supported Devices
- TC72
- BYOD devices

### What this does
OYI makes it possible to efficiently manage inventory by bringing sales floor worklists and weekly audits into one app. OYI helps club associates in Mexico and China focus their daily activity by using data to quickly identify potential missed sales opportunities and correct them on the sales floor. The audits feature allows clubs to maintain inventory accuracy and spot causes of shrink early.

Previously, the information club associates needed to manage their inventory came through data in a separate reporting system. There was no tool that took common exceptions from inventory data to the handheld devices associates use during their normal work on the floor. Without a tool to help manage this, clubs lose revenue because there are often delays between identification of issues and taking the necessary steps to correct these issues before they negatively affect sales.

OYI uses exceptions, such as no sales and missing location, to generate worklists for sales floor associates. OYI can filter these worklists by location, category, or exception type. The initial version of OYI has replaced one feature of CIM - Sales Floor Tool. In the coming months, the other features of CIM are being built into OYI in the US. This will lead to OYI becoming a suite of inventory apps for associates to use when managing inventory. The backend of OYI uses data coming from the SMART database. After the OYI Pilot, a new initiative will be migrating the data from SMART to the cloud.

Some of the strategic benefits of OYI are:

- Reduce lost sales - Find and fix inventory issues before they affect your club.
- Easily manage your inventory - Quickly find your daily list.
- Be more effective - Take actions without the need for switching apps.
- See your progress - Use the dashboard to check how you are doing.

For more information go to https://collaboration.wal-mart.com/display/ISCM/Own+Your+Inventory

### To run the app
* Clone the repo
* Run `npm install`
* Run `npm start`
* Open up Android Studio
  * Import `oyi-app/android/` as an existing project
* Hit play
  * Note that you must have an emulator set up with Walmart certificates.
  * As well as have the WMSSO apk installed on the emulator
  * For more information go to https://collaboration.wal-mart.com/display/ISCM/Front-End+React+Native+Onboarding

### How the app is structured
* components
  * Elements such as the item worklist card, worklist summary cards, and other components used by multiple screens
* locales
  * Holds your localized strings
  * Supports en, es, and zh locales
* mockData
  * Holds mock data
* models
  * Holds your typescript models
* navigators
  * Holds your stack and tab navigators to link your screens together
    * `MainNavigator` is the top level navigator that links to the Login screen as its initial screen
    * `Tabs` holds the home (Worklist Summary) screen and the Worklist in 2 tabs
    * `ReviewItemDetails` and `PrintPriceSign` are screens that are not supposed to have tabs showing on them 
* screens
  * Most of the screen names should be self-explanatory
    * `Home` is the Worklist Summary screen
    * `Worklist` is divided into 2 sub-tabs which is contained in `TodoWorklist` and `CompletedWorklist` in this sub-directory
* Services
  * Holds the `axios`-based Request library to make API calls and has 1 service file per API call
* state
  * All the redux actions/reducers/sagas
    * Note: For API calls, all API actions are contained within the `actions/asyncAPI.ts` file, but those actions get dispatched as a result of the async saga being initially dispatched from `actions/saga.ts`
    * The saga execution (and subsequent API actions) are dispatched from their respective sagas contained in `sagas/index.ts`
    * See "How to set up an API call" below for further explanation
* themes
  * Contains color values

### How to emulate a barcode scan (value only)
- In your debugger console: `window.mockScan('value', 'type')`

### How to emulate a barcode scan using the camera on the emulator to scan real barcode
  1. in AVD manager under tools of android studio make sure the back camera is set to 'VertualScene'(under advanced settings)
  2. once application is running on emulator select extended controls from side menu
  3. go to camera menu, you can load 2 images at a time load images with barcodes you wish to test (both upc and shelf label barcodes are UPC-A
  4. in dev and stage environment there should be a camera icon in the header of any screen that allows scanning, cick on this icon to open camera
  5. you camera will be looking at a vertual scene, using the option key(for mac) + Q,W,E,A,S,D navigate to the romm behind where you start in scene
  6. move camera over ether barcode and it should scan the barcode

### How to use the Manual Scan component
* Add a button to the screen's header in the navigator
* Have the button toggle the `state.Global.isManualScanEnabled` variable
* Add `{isManualScanEnabled && <ManualScanComponent />}` in your component before the ScrollView

TIP: Make sure your barcodeEmitter has a listener setup to receive `scanned` events.

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

