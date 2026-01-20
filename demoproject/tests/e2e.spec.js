import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/login.page";
import {InventoryPage} from "../pages/inventory.page";
import {CartPage} from "../pages/cart.page";
import {CheckoutStepOnePage} from "../pages/checkout-step-one.page";
import {CheckoutStepTwoPage} from "../pages/checkout-step-two.page";

async function login(page, username, password) {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(username, password);
}
test('User successfully logs in', async ({page}) => {
    await login(page, 'standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('User successfully adds an item to cart', async ({page}) => {
    const inventoryPage = new InventoryPage(page);

    await login(page, 'standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart();
    await inventoryPage.openCart();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');
});

test('User successfully goes to checkout', async ({page}) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await login(page, 'standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart();
    await inventoryPage.openCart();
    await cartPage.goToCheckout();
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
});

test('User successfully fills out checkout form', async ({page}) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);

    await login(page, 'standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart();
    await inventoryPage.openCart();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Fleece Jacket');
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Name', 'LastName', '12345');
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});

test('User successfully finishes checkout', async ({page}) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await login(page, 'standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart();
    await inventoryPage.openCart();
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Name', 'LastName', '12345');
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(checkoutStepTwoPage.totalPrice).toHaveText('Total: $53.99');
    await checkoutStepTwoPage.finishCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});