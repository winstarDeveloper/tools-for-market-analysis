/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";

import store from "./../redux/store";
import * as MarketStatus from "./../redux/dataObjects/marketStatus";
import * as NseURL from "./utils/NSE_Urls";

 async function getMarketStatus () {
  try {
    const market_status_url = NseURL.Nse_main_URL + NseURL.MarketStatusURL;

    const response = await fetch(market_status_url);
    const Data = await response.json();

    if (Data) {
      store.dispatch(MarketStatus.actions.addMarketStatus(Data.marketState));
    }
    // console.log("Market Status: ", this.state.marketStatus);
  } catch (err) {
    setTimeout(getMarketStatus, 3000);
    console.log("Error: ", err.message);
  }
}

export default function App({ store, persistor, basename }) {
  getMarketStatus();
  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider>
                {/* Render routes with provided `Layout`. */}
                <Routes />
              </I18nProvider>
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
