export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.cart = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
        this.addToCart = page.locator('.btn_inventory');
    }

    async addItemToCart() {
        const items = await this.inventoryItems.all();
        const prices = await Promise.all(items.map(async item => {
            const priceElement = await item.locator('.pricebar > .inventory_item_price');
            return parseFloat((await priceElement.textContent()).replace('$', ''));
        }));
        const sortedItems = items.sort((a, b) => prices[items.indexOf(a)] - prices[items.indexOf(b)]);
        await sortedItems.reverse()[0].locator('.btn_inventory').click();
    }

    async openCart() {
        await this.cart.click();
    }

    async getPageTitle() {
        return this.title.textContent();
    }
}