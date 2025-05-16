import { firebase } from "@react-native-firebase/app-check";

const firebaseAppCheckToken = async () => {
  try {
    const appCheck = firebase.appCheck();

    const rnfbProvider = appCheck.newReactNativeFirebaseAppCheckProvider();

    rnfbProvider.configure({
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: "71406E95-D73C-4D52-8D96-21EE684C2DF6",
      },
    });

    await appCheck.initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    const appCheckTokenFB = await appCheck.getToken();

    const [{ isTokenValid }] = await sendTokenToApi({
      appCheckToken: appCheckTokenFB.token,
    });

    if (isTokenValid) {
      // Perform Action for the legal device
    } else {
      // Perform Action for illegal device
    }
  } catch (e) {
    // Handle Errors which can happen during token generation
    console.log(e);
  }
};
