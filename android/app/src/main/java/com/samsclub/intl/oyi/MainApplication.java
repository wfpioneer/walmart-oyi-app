package com.samsclub.intl.oyi;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.walmart.ssmp.platform.core.PlatformCore;
import com.walmart.ssmp.platform.core.di.CoreComponent;
import com.walmart.ssmp.platform.core.helpers.PlatformCoreProvider;
import dagger.android.AndroidInjector;
import androidx.work.Configuration;

public class MainApplication extends Application implements ReactApplication, PlatformCoreProvider {
  private PlatformCore platformCore = null;

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    initialize();
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  // Add the following method
  @Override
  public AndroidInjector < Object > androidInjector() {
    initialize();
    return platformCore.androidInjector();
  }

  // Add the following method
  @Override
  public Configuration getWorkManagerConfiguration() {
    initialize();
    return platformCore.workManagerConfiguration();
  }

  // Add the following method
  @Override
  public CoreComponent coreComponent() {
    initialize();
    return platformCore.coreComponent();
  }

  // Add the following method
  private void initialize() {
    if (platformCore == null) {
      synchronized(this) {
        if (platformCore == null) {
          platformCore = new PlatformCore();
          platformCore.initialize(this);
        }
      }
    }
  }
}
