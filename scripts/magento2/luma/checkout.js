var WEBSITE_URL = 'http://magento-site.com/';

var By = $driver.By;
var assert = require('assert');

var submitShippingDetails = function () {
    $browser.findElement(By.id('customer-email')).sendKeys('mail@example.com');
    $browser.findElement(By.css('input[name="firstname"]')).sendKeys('John');
    $browser.findElement(By.css('input[name="lastname"]')).sendKeys('Smith');
    $browser.findElement(By.css('input[name="street[0]"]')).sendKeys('1234 Street');
    $browser.findElement(By.css('input[name="city"]')).sendKeys('Los Angeles');
    $browser.findElement(By.css('option[value="12"]')).click();
    $browser.findElement(By.css('input[name="postcode"]')).sendKeys('90001');
    $browser.findElement(By.css('input[name="telephone"]')).sendKeys('123-123-1234');
};

$browser.get(WEBSITE_URL).then(function () {
    console.log('Go to a category.');
    return $browser.findElement(By.css('.ui-menu a.level-top')).click();
}).then(function () {
    console.log('Add a product to the Shopping Cart.');
    return $browser.findElement(By.css('button[title="Add to Cart"]')).click();
}).then(function () {
    return $browser.wait($driver.until.elementIsVisible($browser.findElement(By.css('.counter.qty')))).then(function () {
        console.log('Open the mini cart.');
        $browser.findElement(By.css('a.showcart')).click();
    });
}).then(function () {
    console.log('Go to the Checkout process');
    return $browser.findElement(By.id('top-cart-btn-checkout')).click();
}).then(function () {
    console.log('Submit shipping details.');
    return submitShippingDetails();
}).then(function () {
    console.log('Choose a shipping method.');
    return $browser.wait($driver.until.elementIsVisible($browser.findElement(By.id('s_method_flatrate_flatrate')))).then(function () {
        $browser.findElement(By.id('s_method_flatrate_flatrate')).click();
    });
}).then(function () {
    console.log('Go to the payment options.');
    return $browser.findElement(By.css('#shipping-method-buttons-container button')).click();
}).then(function () {
    console.log('Place Order.');
    return $browser.wait($driver.until.elementIsNotVisible($browser.findElement(By.css('.loading-mask')))).then(function () {
        return $browser.findElement(By.css('button[title="Place Order"]')).click();
    });
}).then(function () {
    console.log('Order success page.');
    return $browser.waitForAndFindElement(By.xpath('//*[@id="maincontent"]/div[3]/div/div[2]/p[1]/span'), 7500).then(function (element) {
        element.getText().then(function (orderNum) {
            console.log('Assert order number: %s.', orderNum);
            assert.ok(/^\d+$/.test(orderNum), "Invalid order number.");
        });
    });
});