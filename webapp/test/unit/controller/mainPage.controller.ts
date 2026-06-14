/*global QUnit*/
import Controller from "com/san/portfolio/controller/main.controller";

QUnit.module("main Controller");

QUnit.test("I should test the main controller", function (assert: Assert) {
	const oAppController = new Controller("main");
	oAppController.onInit();
	assert.ok(oAppController);
});