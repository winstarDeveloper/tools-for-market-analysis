export const checkMarketStatus = ({marketStatus}) => {
  if (marketStatus.marketStatus) {
    const mktStatus = marketStatus.marketStatus;
    for (let i = 0; i < mktStatus.length; i++) {
      if (
        mktStatus[i].market === "Capital Market" &&
        mktStatus[i].marketStatus === "Open"
      ) {
        return true;
      }
    }
  }

  return false;
};
