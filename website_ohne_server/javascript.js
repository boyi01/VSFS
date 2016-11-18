var vendor_prefix = ["moz", "webkit", "ms", "o", ""];
var e = document.getElementById("fullscreen-img1");
var d = document.getElementById("fullscreen-img2");
var f = "";
d.addEventListener("click", setD);
e.addEventListener("click", setE);
function VendorPrefixMethod(obj, method) {
    var p = 0, m, t;
    while (p < vendor_prefix.length && !obj[m]) {
        m = method;
        if (vendor_prefix[p] == "") {
            m = m.substr(0,1).toLowerCase() + m.substr(1);
        }
        m = vendor_prefix[p] + m;
        t = typeof obj[m];
        if (t != "undefined") {
            vendor_prefix = [vendor_prefix[p]];
            return (t == "function" ? obj[m]() : obj[m]);
        }
        p++;
    }
}
        
        function setD(){
            f = d;
            onclick();
            
        }
        function setE(){
            f = e;
            onclick();
        }
function onclick(){
    if (VendorPrefixMethod(document, "FullScreen") || VendorPrefixMethod(document, "IsFullScreen")) {
            VendorPrefixMethod(document, "CancelFullScreen");
    }
    else{
        VendorPrefixMethod(f, "RequestFullScreen");
    } 
}