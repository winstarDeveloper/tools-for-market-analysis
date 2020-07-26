export const cors_proxy = "https://jsonp.afeld.me/?callback=&url=";
export const Nse_main_URL = cors_proxy + "https://www.nseindia.com/api/";
export const Derivatives_URL = "liveEquity-derivatives?index="; // Possible Index: { top20_contracts, stock_fut, stock_opt, top20_spread_contracts, nse50_fut, nse50_opt, nifty_bank_fut, nifty_bank_opt}
export const AllSymbolsURL = "master-quote";
export const OptionChainIndicesURL = "option-chain-indices?symbol=";
export const OptionChainEquitesURL = "option-chain-equities?symbol=";
export const MarketStatusURL = "marketStatus";
export const AllIndicesURL = "allIndices";
export const CommoditySpotRatesURL = "refrates?index=commodityspotrates";
export const GainersURL = "live-analysis-variations?index=gainers";
export const LoosersURL = "live-analysis-variations?index=loosers";