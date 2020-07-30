import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LiveMarket } from "./pages/LiveMarket";
import ViewAllIndices from "./pages/LiveMarket/ViewAllIndices";
import ViewAllCommodities from "./pages/LiveMarket/ViewAllCommodities";
import HeatMap from "./pages/LiveMarket/HeatMap";
import NiftyWeightage from "./pages/LiveMarket/NiftyWeightage";
import { DerivativeAnalysis } from "./pages/DerivativeAnalysis";
import  SpotFutureSpread from "./pages/Derivatives/Futures/SpotFutureSpread";
import  OIVolumeAnalysis from "./pages/Derivatives/Options/OIVolumeAnalysis";
import OptionGreeksCalculator from "./pages/Derivatives/Options/OptionGreeksCalculator";
import { PairTrades } from "./pages/PairTrades";
import { MarketBuzz } from "./pages/MarketBuzz";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {/* Redirect from root URL to /dashboard. */}
        <Redirect exact from="/" to="/dashboard" />

        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/livemarket/viewallindices" component={ViewAllIndices} />
        <ContentRoute path="/livemarket/viewallcommodity" component={ViewAllCommodities} />
        <ContentRoute path="/livemarket/heatmap" component={HeatMap} />
        <ContentRoute path="/livemarket/niftyweightage" component={NiftyWeightage} />
        <ContentRoute path="/livemarket" component={LiveMarket} />
        <ContentRoute path="/derivative/futures/spotfutspread" component={SpotFutureSpread} />
        <ContentRoute path="/derivative/options/oi-vol-analysis" component={OIVolumeAnalysis} />
        <ContentRoute path="/derivative/options/option-greeks-calculator" component={OptionGreeksCalculator} />
        <ContentRoute path="/derivative" component={DerivativeAnalysis} />
        <ContentRoute path="/pairtrades" component={PairTrades} />
        <ContentRoute path="/marketbuzz" component={MarketBuzz} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
