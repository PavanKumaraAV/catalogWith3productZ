// Product list
const products = [
    { name: "Product A", price: 20 },
    { name: "Product B", price: 40 },
    { name: "Product C", price: 50 },
];

// Discount rules
const discountRules = {
    flat_10_discount: { threshold: 200, discount: 10 },
    bulk_5_discount: { threshold: 10, discount: 5 },
    bulk_10_discount: { threshold: 20, discount: 10 },
    tiered_50_discount: { quantityThreshold: 30, singleProductThreshold: 15, discount: 50 },
};

// Fees
const giftWrapFee = 1;
const packageCapacity = 10;
const shippingFeePerPackage = 5;

// Function to calculate the total amount for a each product
const calculateProductTotal = (product, quantity) => {
    return product.price * quantity;
}

// Function to calculate the applicable discount based on the discount rules
calculateApplicableDiscount = (cartTotal, productQuantities) => {
    let applicableDiscount = null;

    // Check If cart total exceeds $200 & apply a flat $10 discount on the cart total.
    if (cartTotal > discountRules.flat_10_discount.threshold) {
        applicableDiscount = discountRules.flat_10_discount;
    }

    // Check If quantity of any single product exceeds 10 units, apply a 5% discount on that item's total price
    for (const quantity of productQuantities) {
        if (quantity > discountRules.bulk_5_discount.threshold) {
            applicableDiscount = discountRules.bulk_5_discount;
            break;

        }
    }

    // Check If total quantity exceeds 20 units & apply a 10% discount on the cart total.
    const totalQuantity = productQuantities.reduce((total, quantity) => total + quantity, 0);
    if (totalQuantity > discountRules.bulk_10_discount.threshold) {
        applicableDiscount = discountRules.bulk_10_discount;
    }

    //Check if the total quantity exceeds 30 units & any single product quantity greater than 15, then apply a 50% discount on products which are above  15 quantity
    if (
        totalQuantity > discountRules.tiered_50_discount.quantityThreshold &&
        productQuantities.some((quantity) => quantity > discountRules.tiered_50_discount.singleProductThreshold)
    ) {
        applicableDiscount = discountRules.tiered_50_discount;
    }

    return applicableDiscount;
}

// Function to calculate the shipping fee based on the number of packages required
calculateShippingFee = (totalQuantity) => {
    const packageCount = Math.ceil(totalQuantity / packageCapacity);
    return packageCount * shippingFeePerPackage;
}

// Function to calculate the total amount including discounts, fees, and shipping
calculateTotal = (productQuantities, giftWrapQuantities) => {
    let subtotal = 0;
    let totalDiscount = 0;
    let offer = {}


    // Calculate the subtotal and apply the applicable discount
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const quantity = productQuantities[i];
        const productTotal = calculateProductTotal(product, quantity);
        subtotal += productTotal;

        const applicableDiscount = calculateApplicableDiscount(subtotal, productQuantities);
        if (applicableDiscount) {
            if (applicableDiscount === discountRules.tiered_50_discount) {
                const quantityAboveThreshold = Math.max(quantity - discountRules.tiered_50_discount.singleProductThreshold, 0);
                const discountAmount = (quantityAboveThreshold * product.price * discountRules.tiered_50_discount.discount) / 100;
                totalDiscount += discountAmount;

            } else {

                if (applicableDiscount == discountRules.bulk_5_discount) {

                    if (quantity > 10) {
                        const discountAmount = (productTotal * applicableDiscount.discount) / 100;
                        totalDiscount += discountAmount;
                    }
                }
                else {
                    const discountAmount = (productTotal * applicableDiscount.discount) / 100;
                    totalDiscount += discountAmount;
                }
            }
        }

        offer = applicableDiscount
        

    }

// To find the name of the discount applied
    const discountApplied = () => {

            switch (offer) {
                case discountRules.flat_10_discount: offerApplied = "Flat 10% discount"
                    break;
                case discountRules.bulk_5_discount: offerApplied = "Bulk 5% discount"
                    break;
                case discountRules.bulk_10_discount: offerApplied = "Bulk 10% discount"
                    break;
                case discountRules.tiered_50_discount: offerApplied = "Tiered 50% discount"
                    break;
                default: offerApplied = "Currently there is no Offer"
                    break;
            }
            return offerApplied
        }



    // Calculate the gift wrap fee
    
    const giftWrapFeeTotal = giftWrapQuantities.reduce((total, quantity) => total + quantity * giftWrapFee, 0);

    // Calculate the shipping fee
    const totalQuantity = productQuantities.reduce((total, quantity) => total + quantity, 0);
    const shippingFee = calculateShippingFee(totalQuantity);

    // Calculate the total amount
    const total = subtotal - totalDiscount + giftWrapFeeTotal + shippingFee;

    const discountName = discountApplied()

    return {
        subtotal,
        discount: totalDiscount,
        shippingFee,
        giftWrapFee: giftWrapFeeTotal,
        total,
        discountName
    };
}

// Example usage
const productQuantities = [1, 1, 1]; // Enter the quantity for each product
const giftWrapQuantities = [20, 10, 0]; // Enter the quantity to be wrapped as gifts (0 if not wrapped)

const result = calculateTotal(productQuantities, giftWrapQuantities);

// Output the result
console.log("Product Details:");
for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const quantity = productQuantities[i];
    const productTotal = calculateProductTotal(product, quantity);
    console.log(`${product.name} - Quantity: ${quantity} - Total: $${productTotal}`);
}

console.log("\nSubtotal:", result.subtotal);
console.log("Discount Applied:", result.discount > 0 ? result.discountName : result.discountName , "- Amount: $", result.discount);
console.log("Shipping Fee:", "$" + result.shippingFee);
console.log("Gift Wrap Fee:", "$" + result.giftWrapFee);
console.log("Total:", "$" + result.total);


