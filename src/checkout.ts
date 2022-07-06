type Product = {
    id: string,
    description: string;
    price: number;
};

const products: Record<string, Product> = {
    "R1": {
        id: "R1",
        description: "Private company limited by shares (Limited or Ltd)",
        price: 20,
    },
    "R2": {
        id: "R2",
        description: "Public limited company (PLC)",
        price: 30,
    },
    "R3": {
        id: "R3",
        description: "Limited liability partnership (LLP)",
        price: 60,
    },
};

interface PricingRule {
    applyDiscount(products: Product[], discountCodes: string[], discountsApplied: number[]): number
}

class ReducedR1 implements PricingRule {
    applyDiscount(productsInCheckout: Product[]): number {
        const numR1 = productsInCheckout.filter(product => product.id === "R1").length
        if (numR1 >= 3) {
            return numR1 * products["R1"].price / 2
        }

        return 0;
    }
}

class R3Bogof implements PricingRule {
    applyDiscount(productsInCheckout: Product[]): number {
        const numR3 = productsInCheckout.filter(product => product.id === "R3").length
        const numFree = Math.floor(numR3 / 2) 

        return numFree * products["R3"].price;
    }
}

class Register30 implements PricingRule {
    applyDiscount(products: Product[], discounts: string[], discountsApplied: number[]): number {
        if (!discounts.includes("REGISTER30")) {
            return 0;
        }

        const totalDiscounts = sum(discountsApplied)
        const minus30 = sum(products.map(p => p.price)) * 0.30

        if (totalDiscounts > minus30) {
            return 0;
        }

        return minus30 - totalDiscounts
    }

}

function sumPrices(products: Product[]): number {
    return products.map(p => p.price).reduce((sum, price) => sum + price, 0)
}

function sum(nums: number[]): number {
    return nums.reduce((sum, n) => sum + n, 0)
}

const defaultRules = [
    new ReducedR1(),
    new R3Bogof(),
    new Register30(),
]

class Checkout {
    private products: Product[] = []
    private discounts: string[] = []

    constructor(private pricingRules: PricingRule[] = defaultRules) {}

    public addProduct(productCode: string): void {
        if (!(productCode in products)) throw `no product with code ${productCode}`

        this.products.push(products[productCode])
    }

    public addDiscountCode(code: string): void {
        this.discounts.push(code)
    }

    public total(): number {
        const costOfProducts = sumPrices(this.products);

        const discounts: number[] = []
        for (let rule of this.pricingRules) {
            const discount = rule.applyDiscount(this.products, this.discounts, discounts)
            discounts.push(discount)
        }

        const totalDiscount = sum(discounts)
        return costOfProducts - totalDiscount
    }
}

export { Checkout };
