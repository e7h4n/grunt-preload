/*jslint browser: true*/
/*global test, ok*/

/**
 * @preload ./preload/dummy.js
 */

test('preload', function () {
    ok(true === window.dummyVariable);
});
