let arr = [
    {
        country: 'USA',
        population: 331002651,
        area: 9372610,
        capital: 'Washington D.C.'
    },
    {
        country: 'Russia',
        population: 146793759,
        area: 17125242,
        capital: 'Moscow'
    },
    {
        country: 'China',
        population: 1439323776,
        area: 9640011,
        capital: 'Beijing'
    },
    {
        country: 'India',
        population: 1380004385,
        area: 3287590,
        capital: 'New Delhi'
    },
];
let totalArea = arr.reduce((sum, country) => sum + country.area, 0);
console.log(totalArea) 
