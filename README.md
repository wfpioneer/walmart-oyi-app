# OYI-Android

This is the Android version of OYI, currently only designed to be deployed on internal TC devices.

### Currently Supported Devices

- TC70
- TC70X
- TC72

#### Future Supported Devices

- TC75
- CN specific device(s)
- BYOD devices

### What this does

OYI makes it possible to efficiently manage inventory by bringing sales floor worklists and weekly audits into one app.
OYI helps club associates in Mexico and China focus their daily activity by using data to quickly identify potential
missed sales opportunities and correct them on the sales floor. The audits feature allows clubs to maintain inventory
accuracy and spot causes of shrink early.

Previously, the information club associates needed to manage their inventory came through data in a separate reporting
system. There was no tool that took common exceptions from inventory data to the handheld devices associates use during
their normal work on the floor. Without a tool to help manage this, clubs lose revenue because there are often delays
between identification of issues and taking the necessary steps to correct these issues before they negatively affect
sales.

OYI uses exceptions, such as no sales and missing location, to generate worklists for sales floor associates. OYI can
filter these worklists by location, category, or exception type. The initial version of OYI has replaced one feature of
CIM - Sales Floor Tool. In the coming months, the other features of CIM are being built into OYI in the US. This will
lead to OYI becoming a suite of inventory apps for associates to use when managing inventory. The backend of OYI uses
data coming from the SMART database. After the OYI Pilot, a new initiative will be migrating the data from SMART to the
cloud.

A few of the strategic benefits of OYI are:

- Reduce lost sales - Find and fix inventory issues before they affect your club.
- Easily manage your inventory - Quickly find your daily list.
- Be more effective - Take actions without the need for switching apps.
- See your progress - Use the dashboard to check how you are doing.

For more information go to https://collaboration.wal-mart.com/display/ISCM/Own+Your+Inventory

## Getting Started

### Use the latest stable Node and NPM versions

* Using a version manager like [Node Version Manager](https://github.com/nvm-sh/nvm) makes it simple to manage node
  versions
    * the command `nvm ls-remote --lts` will list all available stable versions of node
    * to install a desired version, use `nvm install` eg: `nvm install 14.17.3`
    * to set it as your default node version, use `nvm alias default` eg: `nvm alias default 14.17.3`
    * after installing a new version, get the latest version of NPM via `npm install -g npm`

### AppCenter Secrets

* OYI uses the AppCenter SDK and react-native library in order to track user events, analytics, and crash reports
    * This file is installed as part of the `.apk` build process and not part of the `react-native` build process. It is
      not necessary for `Dev` builds
    * In order to report events to AppCenter, we need to keep a set of AppCenter secrets associated with our different
      environments
    * If creating a `Stage` or `Prod` build locally, you'll need to be sure you have an `appcenter-config.json` file
      defined as follows:
        * Create a file: `android/app/src/main/assets/appcenter-config.json` containing the Stage config from
          our [Secret Properties Confluence Page ]( https://collaboration.wal-mart.com/pages/viewpage.action?pageId=627157432#OYIPropertySecrets-OYI-APPappcenter-config.json )
          matching the desired environment.
    * This file is ignored in our `.gitignore`
    * During the looper build process, we create this file using the proper values pulled from the `APPCENTER_SECRET`
      looper-encrypted values defined in our `.looper.yml` and `.looper.staging.yml`

### CN Item Image Secrets

* For CN Market images for item are fetched by calling image api and it uses client id and auth key, so locally create a new file Secrets.json under src/constant/ directory and add those keys.
* You can find those secrets in https://confluence.walmart.com/pages/viewpage.action?pageId=1060167829#OYIPropertySecrets-CNItemImageAPISecrets copy and paste in Secrets.json
* After adding the above secrets, image can be shown for CN market locally in dev environment.

### To run the app

* Clone the repo
* Run `npm install`
* Run `npm start`
* Open up Android Studio
    * Import `oyi-app/android/` as an existing project
* Hit play
    * Note that you must have an emulator set up with Walmart certificates.
    * Also, you must have the WMSSO apk installed on the emulator
    * For more information go to https://collaboration.wal-mart.com/display/ISCM/Front-End+React+Native+Onboarding
    
### To run the app on an actual Android device

* Ensure your device is connected to your laptop via USB
* Run `adb reverse tcp:8081 tcp:8081`. This ensures that all calls made to `localhost:8081` from the device get forwarded to your laptop.
* Follow the steps above in "To run the app"

### How the app is structured

* components
    * Elements such as the item worklist card, worklist summary cards, and other components used by multiple screens
* locales
    * Holds your localized strings
    * Supports en, es, and zh locales
* mockData
    * Holds mock data for service calls
* models
    * Holds your typescript models
* navigators
    * Holds your stack and tab navigators to link your screens together
        * `MainNavigator` is the top level navigator that links to the Login screen as its initial screen
        * `Tabs` holds the Home (Worklist Summary), Worklist, Tools, and Manager Approval screens in 4 tabs
        * `ReviewItemDetails`, `PrintPriceSign`, and `LocationManagement` are screens that are not supposed to have tabs
          showing on them
* screens
    * Most of the screen names should be self-explanatory
        * `Home` is the Worklist Summary screen
        * `Worklist` is divided into 2 sub-tabs which is contained in `TodoWorklist` and `CompletedWorklist` in this
          sub-directory
        * `LocationManagement` will have 4 screens
* Services
    * Holds the `axios`-based Request library to make API calls and has 1 service file per API call (will be changed to
      multiple calls per files, with the files representing a microservice)
* state
    * All the redux actions/reducers/sagas
        * Note: For API calls, all API actions are contained within the `actions/asyncAPI.ts` file, but those actions
          get dispatched as a result of the async saga being initially dispatched from `actions/saga.ts`
        * The saga execution (and subsequent API actions) are dispatched from their respective sagas contained
          in `sagas/index.ts`
        * See "How to set up an API call" below for further explanation
* themes
    * Contains color values

#### iOS Directory Removal

* as part of a new security initiative, a secrets-scanning process began finding false positives within the `ios`
  directory with regard to the `WMSSO.framework`'s `WMSSO` binary
* the quick and easy solution that we went with was to simply delete the `ios` directory
    * we are only building/deploying to android devices at this time
    * if/when OYI needs to support `iOS` devices, we can restore this directory and ignore the `WMSSO` binary via
      the `.sentinelpolicy` [file-level ignore mechanism](https://gecgithub01.walmart.com/ISRM/wmsecestTraining/blob/0cbe02304e647adf359b9c59ac6f72917d752542/.sentinelpolicy#L62)

### How to emulate a barcode scan (value only)

- In your debugger console: `window.mockScan('value', 'type')`

### How to emulate a barcode scan using the camera on the emulator to scan real barcode

1. in AVD manager under tools of android studio make sure the back camera is set to 'VirtualScene'(under advanced
   settings)
2. once application is running on emulator select extended controls from side menu
3. go to camera menu, you can load 2 images at a time load images with barcodes you wish to test (both upc and shelf
   label barcodes are UPC-A)
4. in dev and stage environment there should be a camera icon in the header of any screen that allows scanning, click on
   this icon to open camera
5. your camera will be looking at a virtual scene, using the option key(for mac) + Q,W,E,A,S,D navigate to the room
   behind where you start in scene
6. move camera over ether barcode, and it should scan the barcode

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
   You can also insert the payload as a `body` for POST requests, and you can also insert custom headers as desired
   here. When providing a payload, any payload that is passed into the saga action will be passed into the first
   argument in this function.
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

### How to change the working Environment for API calls

1. (Preferred) In Android Studio
    * Go to `View -> Tool Windows -> Build Variants`
    * Find the `OYI.app` module and set the build variant to `development/staging/production`Debug
    * Build and run the application

2. Alternatively, open up the environment file called `.env`
    * Set `ENVIRONMENT= `to either dev/stage/prod
    * Rebuild and Re-run the App in Android Studio

### Tests

The primary tests are currently snapshot tests. Ongoing effort is being made to get snapshot tests for all navigators,
screens, and components. Logic (unit) tests and integration/end-to-end tests will be the next effort after snapshots are
completed.

The expectation is that all new code has appropriate snapshot tests, covering all input variations.

## Fluffy Feature Toggle and Authorization

Fluffy is used to control both feature toggling and user authorization. The portal can be access
at [wmlink/fluffy-stg](https://wmlink.wal-mart.com/fluffy-stg), and then clicking the `GO TO FLUFFY` button in the top
right.

Fluffy features can be found in `User.features` as an array of strings, and accessed
through `useTypedSelector(state => state.User.features)`. Check if this array includes the appropriate feature to
determine what to render or how to handle logic.

Due to some constraints in how Fluffy handles userIds and test stores/clubs, special logic has been added to the Fluffy
service file before the call occurs. In a dev build, the variables sent to Fluffy get set to US values. If the clubNbr
used by the user is a test club (5522 and 5597 for MX and CN, respectively), the clubNbr is set to a pilot club for
Fluffy only.

### Current Feature Toggles

* Manager Approval
* Location Management

### Current Authorization

* Manager Approval

## Deploying to Airwatch

The below is old (but kept for historical sake)
. [This](https://collaboration.wal-mart.com/display/ISCM/FE+Airwatch+Release+Process)
Confluence page should be followed instead, until we get full automation working with "Testing Products" from the
AirWatch team.

## TODOs

* Update to the latest versions of `jest` and `babel-jest` once they fix regression or establish a workaround
    * We are currently not using the latest version of `jest` and `babel-jest` due to
      a [regression introduced in version 27](https://github.com/facebook/jest/issues/11500) that hits some of our test
      cases that use an `async` callback in their `it` calls

---------OLD!! DO NOT USE!!!-----------

Apk builds are automatically deployed & activated in AirWatch after merging into `Development` or `Master`. AirWatch has
a set limit of 5 apk's per application, and an old product will need to be deleted after a merge into `Development`
or `Master`.

1. Finding the Product Name in AirWatch
    1. Login to [AirWatch](https://mdmadmin.wal-mart.com/)
    2. Under `Devices` on left side. Click `Provisioning` then `Product List View`.
    3. In the search bar type `OYI` and view products named `Oyi-International`

2. Deactivating an old product
    1. Go to the Concord Workflow
       to [Deactivate a Product](https://collaboration.wal-mart.com/display/MOBILE/Deactivate+a+Product) and click the
       Workflow link
    2. Add the Old product name found in AW into `Product Name:` i.e.`OYI-International ${VERSION}`
       or `OYI-International ${environment}${VERSION}`
    3. Set `AirWatch Environment` to `PROD` and submit

3. Deleting a product
    1. Then go
       to [Delete a Product and Smart Group](https://collaboration.wal-mart.com/display/MOBILE/Delete+a+Product+and+Smart+Group)
       and click the Workflow Link
    2. Add the same `Product Name` &`AirWatch Environment` and submit the product for deletion.
