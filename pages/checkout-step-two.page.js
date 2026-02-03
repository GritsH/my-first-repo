export class CheckoutStepTwoPage{
    constructor(page) {
        this.page = page;
        this.finishButton = page.locator('[data-test="finish"]');
        this.totalPrice = page.locator('.summary_total_label');
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
}