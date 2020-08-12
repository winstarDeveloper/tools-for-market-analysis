import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
  ADD_MARKET_STATUS: "ADD_MARKET_STATUS",
};

const initialAuthState = {
  marketStatus: [],
};

export const reducer = persistReducer(
  { storage, key: "v706-demo1-auth", whitelist: ["marketStatus"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.ADD_MARKET_STATUS: {
        const { mktState } = action.payload;
        return { ...state, marketStatus: mktState };
      }
      default:
        return state;
    }
  }
);

export const actions = {
  addMarketStatus: (mktState) => ({
    type: actionTypes.ADD_MARKET_STATUS,
    payload: { mktState },
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.ADD_MARKET_STATUS,
    function* addMarketStatusSaga() {
      yield put(actions.addMarketStatus());
    }
  );
}
