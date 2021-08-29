// API Call to google geocoder
const geocoderGET = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))
}


// module.exports = {
//     geocoderGET: () => {
//         fetch('https://jsonplaceholder.typicode.com/todos/1')
//             .then(response => response.json())
//             .then(json => console.log(json))
//     }
// }
let body = {
    name: 'd',
    buyPrice: '2',
    address: '3214 Mission St',
    'fees.propertyTax': '2',
    'fees.hoaFees': '2',
    'fees.homeInsurance_cost': '2',
    'fees.renterInsuranceCost': '2',
    img: ''
  }
let fees = {}
for (const key in body){
    if(key.includes('fees.')){
        fees[key.slice(5)] = body[key]
}}
body.fees = fees
// Object.keys(body)
// console.log()
// console.log(fees)
let string = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(body.address) + `&key=${process.env.APIKEY}`
console.log(string)