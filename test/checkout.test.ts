import { Checkout } from "../src/checkout";

describe("checkout tests", () => {
    it("should sum product prices when no discounts are applied", async () => {
        const checkout = new Checkout()

        checkout.addProduct("R1")
        checkout.addProduct("R2")
        checkout.addProduct("R3")

        expect(checkout.total()).toBe(110)
    });

    it("should use a reduced price for Ltd's when three or more is bought", async () => {
        const checkout = new Checkout()

        checkout.addProduct("R1")
        checkout.addProduct("R1")
        checkout.addProduct("R1")
        checkout.addProduct("R1")

        checkout.addProduct("R2")
        checkout.addProduct("R3")

        expect(checkout.total()).toBe(130)
    })

    it("should apply a buy one get one free offer for R3's", async () => {
        const checkout = new Checkout()

        checkout.addProduct("R1")
        checkout.addProduct("R2")
        checkout.addProduct("R3")
        checkout.addProduct("R3")
        checkout.addProduct("R3")

        expect(checkout.total()).toBe(170)
    })

    it("it reduces the total by 30% when using discount code", async () => {
        const checkout = new Checkout()

        checkout.addProduct("R1")
        checkout.addProduct("R2")
        checkout.addProduct("R3")
        checkout.addProduct("R3")
        checkout.addProduct("R3")

        checkout.addDiscountCode("REGISTER30")

        expect(checkout.total()).toBe(161)
    })

    it("does not apply discount code when it is cheaper to use other discounts", async () => {
        const checkout = new Checkout()

        checkout.addProduct("R1")
        checkout.addProduct("R1")
        checkout.addProduct("R1")

        checkout.addProduct("R2")
        checkout.addProduct("R2")
        
        checkout.addProduct("R3")
        checkout.addProduct("R3")
        

        checkout.addDiscountCode("REGISTER30")

        expect(checkout.total()).toBe(150)
    })
});