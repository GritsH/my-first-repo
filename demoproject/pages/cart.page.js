export class CartPage {
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.cartItems = page.locator('.cart_item');
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}