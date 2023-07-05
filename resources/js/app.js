import axios from 'axios'
// import { initAdmin } from './admin'
import initAdmin from './admin'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter= document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res =>{
        console.log(res)
        cartCounter.innerText=res.data.totalQty
    })
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

//remove alert message after x seconds
const alertMsg= document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() =>{
        alertMsg.remove()
    }, 2000)
}


initAdmin()