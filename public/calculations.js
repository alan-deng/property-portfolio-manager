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