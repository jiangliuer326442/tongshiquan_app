'use strict'

;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"), require("./lib-typedarrays"), require("./enc-utf16"), require("./enc-base64"), require("./md5"), require("./sha1"), require("./sha256"), require("./sha224"), require("./sha512"), require("./sha384"), require("./sha3"), require("./ripemd160"), require("./hmac"), require("./pbkdf2"), require("./evpkdf"), require("./cipher-core"), require("./mode-cfb"), require("./mode-ctr"), require("./mode-ctr-gladman"), require("./mode-ofb"), require("./mode-ecb"), require("./pad-ansix923"), require("./pad-iso10126"), require("./pad-iso97971"), require("./pad-zeropadding"), require("./pad-nopadding"), require("./format-hex"), require("./aes"), require("./tripledes"), require("./rc4"), require("./rabbit"), require("./rabbit-legacy"));
	}
	else if (typeof define === "function" && define.amd) {
		var	baseUrl = "lib/crypto-js/";
		// AMD
		define([baseUrl+"./core", baseUrl+"./x64-core", baseUrl+"./lib-typedarrays", baseUrl+"./enc-utf16", baseUrl+"./enc-base64", baseUrl+"./md5", baseUrl+"./sha1", baseUrl+"./sha256", baseUrl+"./sha224", baseUrl+"./sha512", baseUrl+"./sha384", baseUrl+"./sha3", baseUrl+"./ripemd160", baseUrl+"./hmac", baseUrl+"./pbkdf2", baseUrl+"./evpkdf", baseUrl+"./cipher-core", baseUrl+"./mode-cfb", baseUrl+"./mode-ctr", baseUrl+"./mode-ctr-gladman", baseUrl+"./mode-ofb", baseUrl+"./mode-ecb", baseUrl+"./pad-ansix923", baseUrl+"./pad-iso10126", baseUrl+"./pad-iso97971", baseUrl+"./pad-zeropadding", baseUrl+"./pad-nopadding", baseUrl+"./format-hex", baseUrl+"./aes", baseUrl+"./tripledes", baseUrl+"./rc4", baseUrl+"./rabbit", baseUrl+"./rabbit-legacy"], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));