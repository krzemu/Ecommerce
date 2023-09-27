const layout = require('./layout');


module.exports = ({ products, card }) => {
    const getTotal = () => {
        // let total = 0;
        // products.forEach(item => {
        //     const { price, q } = item;
        //     total += price * q;
        // });
        return products.reduce((acc, item) => {
            const { price, q } = item;
            return acc + price * q;
        }, 0);
    }

    const renderedProducts = products.map(item => {
        const { title, price, q, id } = item;
        console.log(card);
        return `
        <div class="cart-item message">
            <h3 class="subtitle">${title}</h3>
            <div class="cart-right">
                <div>
                    ${price}  X  ${q} = 
                </div>
                <div class="price is-size-4">
                    ${price * q}
                </div>
                <div class="remove">
                    <form method="POST" action="/cart/products/${id}/delete">
                        <button class="button is-danger">                  
                        <span class="icon is-small">
                        <i class="fas fa-times"></i>
                        </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `
    });

    return layout({
        content: `
        <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
                ${renderedProducts.join('')}
            </div>
            <div class="total message is-info">
              <div class="message-header">
                Total
              </div>
              <h1 class="title">${getTotal()}$</h1>
              <button class="button is-primary">Buy</button>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
      `
    })
};