const stripe = require('stripe')(process.env.STRIPE_SKEY);
const Customer = require('../models/stripe/Customer');

const plan_id = process.env.STRIPE_SUB_PLAN;
const demomode = process.env.DEMOMODE === "true";
/**
 * GET /api/stripe
 * Stripe API example.
 */
exports.getBilling = (req, res) => {
  Customer.findOne((err, customer) => {
    res.render('admin/billing/billing_index', {
      title: 'Billing',
      sidebar: 'app-billing',
      customer: customer,
      demomode: demomode
    });
  });
};

/**
 * POST /api/stripe
 * Make a payment.
 */

// Creating the new customer
var newCustomer = (req, res) => {
  // Create Customer
  stripe.customers.create({
    email: req.body.customer_email,
    name: req.body.customer_name,
    phone: req.body.customer_phone
  }).then(function(customer, err) {
    var newCustomer = new Customer({
      stripe: customer
    });
    //save this customer
    newCustomer.save((err) => {
      //create card for customer
      stripe.customers.createSource(customer.id, {
        card: {
          number: req.body.customer_card,
          exp_month: parseInt(req.body.customer_exp_month),
          exp_year: req.body.customer_exp_year,
          cvc: req.body.customer_cvc
        }
      }, (err, customer_with_card) => {
        //Save Card
        Customer.findOneAndUpdate({
          _id: newCustomer._id
        }, {
          "$set": {
            card: customer_with_card
          }
        }, (err) => {
          //if plan
          if (req.body.plan === 'website') {
            stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                  plan: plan_id,
                }]
              },
              function(err, customer_subscription) {
                Customer.findOneAndUpdate({
                  _id: newCustomer._id
                }, {
                  "$set": {
                    subscription: customer_subscription
                  }
                }, (err) => {
                  res.redirect('/admin/app/billing');
                  // asynchronously called
                });
              });
          } else {
            //if not a plan
            res.redirect('/admin/app/billing');
          }
        });
      });
    });
  });
}

exports.postBilling = (req, res) => {
  console.log('hit');
  console.log(req.body);

  Customer.findOne((err, customerData) => {
    if (customerData === null) {
      newCustomer(req, res);
    } else {
      res.redirect('/admin/app/billing');
    }
  });
}

exports.postUpdateCard = (req, res) => {
  Customer.findOne((err, customer) => {
    var customerId = customer.stripe.id;
    var cardId = customer.card.id;
    stripe.customers.deleteSource(
      customerId,
      cardId,
      function(err, confirmation) {
        stripe.customers.createSource(customerId, {
          card: {
            number: req.body.customer_card,
            exp_month: parseInt(req.body.customer_exp_month),
            exp_year: req.body.customer_exp_year,
            cvc: req.body.customer_cvc
          }
        }, (err, customer_with_card) => {
          if (err) {
            req.flash('errors', {
              msg: err.message
            });
            res.redirect('/admin/app/billing');
            return;
          }

          //Save Card
          Customer.findOneAndUpdate({
            _id: customer._id
          }, {
            "$set": {
              card: customer_with_card
            }
          }, (err) => {
            if (!err) {
              req.flash('success', {
                msg: 'Your Card has been changed.'
              });
              res.redirect('/admin/app/billing');
            } else {
              req.flash('errors', {
                msg: err.message
              });
              res.redirect('/admin/app/billing');
            }
          });
        });
      }
    );
  });
};

exports.postUpdateCustomer = (req, res) => {
  Customer.findOne((err, customer) => {
    var customerId = customer.stripe.id;
    stripe.customers.update(
      customerId, {
        name: req.body.customer_name,
        email: req.body.customer_email,
        phone: req.body.customer_phone
      },
      function(err, updated_customer) {
        if (err) {
          req.flash('errors', {
            msg: err.message
          });
          res.redirect('/admin/app/billing');
          return;
        }

        //Save customer
        Customer.findOneAndUpdate({
          _id: customer._id
        }, {
          "$set": {
            stripe: updated_customer
          }
        }, (err) => {
          if (!err) {
            req.flash('success', {
              msg: 'Your information has been updated.'
            });
            res.redirect('/admin/app/billing');
          } else {
            req.flash('errors', {
              msg: err.message
            });
            res.redirect('/admin/app/billing');
          }
        });
      }
    );
  });
};

exports.postUpdatePlan = (req, res) => {
  Customer.findOne((err, customer) => {
    var customerId = customer.stripe.id;
    var action = req.body.action;

    if (action === "exitplan") {
      var subscriptionId = customer.subscription.id;
      stripe.subscriptions.del(
        subscriptionId,
        function(err, confirmation) {
          if (err) {
            req.flash('errors', {
              msg: err.message
            });
            res.redirect('/admin/app/billing');
            return;
          }

          //remove subscription
          Customer.findOneAndUpdate({
            _id: customer._id
          }, {
            "$set": {
              subscription: null
            }
          }, (err) => {
            if (!err) {
              req.flash('success', {
                msg: 'Your subscription has been cancel successfully.'
              });
              res.redirect('/admin/app/billing');
            } else {
              req.flash('errors', {
                msg: err.message
              });
              res.redirect('/admin/app/billing');
            }
          });

        }
      );
    }

    if (action === "startplan") {
      stripe.subscriptions.create({
          customer: customerId,
          items: [{
            plan: plan_id,
          }]
        },
        function(err, customer_subscription) {
          if (err) {
            req.flash('errors', {
              msg: err.message
            });
            res.redirect('/admin/app/billing');
            return;
          }

          Customer.findOneAndUpdate({
            _id: customer._id
          }, {
            "$set": {
              subscription: customer_subscription
            }
          }, (err) => {
            if (!err) {
              req.flash('success', {
                msg: 'Your subscription has been started successfully. Thank you! We look forward to serving you.'
              });
              res.redirect('/admin/app/billing');
            } else {
              req.flash('errors', {
                msg: err.message
              });
              res.redirect('/admin/app/billing');
            }
          });
        });
    }
  });
};

exports.postBillingOld = (req, res) => {
  // const { stripeToken, stripeEmail } = req.body;
  // stripe.charges.create({
  //   amount: 395,
  //   currency: 'usd',
  //   source: stripeToken,
  //   description: stripeEmail
  // }, (err) => {
  //   if (err && err.type === 'StripeCardError') {
  //     req.flash('errors', { msg: 'Your card has been declined.' });
  //     return res.redirect('/api/stripe');
  //   }
  //   req.flash('success', { msg: 'Your card has been successfully charged.' });
  //   res.redirect('/api/stripe');
  // });
};
