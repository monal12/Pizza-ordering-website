const Order = require('../../../models/order')
const moment=require('moment')
function orderController(){
      return {
        store(req,res){
            //validate request
            const { phone,address } =req.body
            if(!phone || !address){
                req.flash('error','All feilds are required')
                return res.redirect('/cart')
            }
            
            const order=new Order({
                customerId: req.user.id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })
            order.save().then(result =>{
                req.flash('success','Order placed successfully')
                delete req.session.cart
                return res.redirect('/customers/orders')
            }).catch(err =>{
                req.flash('error','Something went wrong')
                console.log(err)
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await Order.find({ customerId: req.user.id},null,{ sort: {'createdAt':-1}})
            res.render('customers/orders',{ orders: orders, moment: moment})

        }
      }
}
module.exports=orderController


