// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

if( !isChrome && !isFirefox ){
    alert( 'This site is optimised for modern navigators like Firefox or Chrome' );
}
