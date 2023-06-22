package com.samsclub.intl.oyi;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.walmart.ssmp.platform.core.PlatformCore;
import com.walmart.ssmp.platform.core.di.CoreComponent;
import com.walmart.ssmp.platform.core.helpers.PlatformCoreProvider;
import dagger.android.AndroidInjector;
import androidx.work.Configuration;

public class MainApplication extends Application implements ReactApplication, PlatformCoreProvider {
  private PlatformCore platformCore = null;

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
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
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
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

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.samsclub.intl.oyi.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
