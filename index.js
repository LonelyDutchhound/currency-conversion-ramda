const R = require('ramda');
const Rf = require('ramda-fantasy');
const axios = require('axios');

(async function(){
    const selectedCart = [ 
        { price: 20 }, 
        { price: 45 }, 
        { price: 67 },
        { price: 1305 }
    ]; 
    const URL = 'https://currate.ru/api/';
    const API_KEY = 'e31b9731d25e18ddb6b7af5601b9be93';
    const CURRENCY_CONIG = [
        "USDRUB",
        "USDEUR",
        "USDGBP",
        "USDJPY"
    ];
    const totalCurrencies = [
        "RUB", 
        "EUR", 
        "GBP", 
        "JPY",
        "USD"
    ];

    const getCurrencyRates = async(url, currencyList, key) => {
        const error =  new Error('can\'t get currency rates data from the service');
        try {
            const response = await axios
                    .get(`${url}?get=rates&pairs=${currencyList.join(',')}&key=${key}`);
            if (response.data.data.length === 0) {                
                throw error;
            }
            return response.data.data;
        } catch (e) {
            return {};
        }
    };

    const currencyList = await getCurrencyRates(URL, CURRENCY_CONIG, API_KEY);
    const converterMap = R.append('1.0', R.values(currencyList));
    const cartSum = R.sum(R.map((elem)=>elem.price, selectedCart));
    const totalPrices = R.ap([R.multiply(cartSum)], converterMap);

    const totalCartPrice = R.zipObj(totalCurrencies, totalPrices);

    console.log(totalCartPrice);
})();
