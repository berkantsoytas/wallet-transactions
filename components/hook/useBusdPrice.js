import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  const json = await res.json();

  return json.market_data.current_price.usd ?? null;
};

export const useBusdPrice = (PRICE) => {
  const { data, ...rest } = useSWR(URL, fetcher, {
    refreshInterval: 1000,
  });

  const price = (data && PRICE / Number(data).toFixed(6)) ?? null;
  return {
    busdPrice: { data, price, ...rest },
  };
};

export default useBusdPrice;
