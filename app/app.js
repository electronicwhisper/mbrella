mbrellaCode = ["template", [], [["let", "x", ["js", [], function() {
    return (3);
}]], ["let", "s", ["state", ["js", [], function() {
    return (6);
}]]], ["let", "f", ["function", ["js", ["x"], function(x) {
    return (function(p, q) {
        return ((p + q) + x)
    });
}]]], ["let", "embeddedTemplate", ["template", ["p"], [], ["element", "div", [], [["element", "b", [], [["text", ["strvalue", "This is embedded: "]], ["text", ["insert", ["js", ["p"], function(p) {
    return (p + (2));
}]]]]]]]]]], ["element", "div", [], [["text", ["strvalue", "\n        x: "]], ["text", ["insert", ["js", ["x"], function(x) {
    return x;
}]]], ["element", "br", [], []], ["text", ["strvalue", "\n        s: "]], ["text", ["insert", ["js", ["s"], function(s) {
    return s;
}]]], ["element", "br", [], []], ["text", ["strvalue", "\n        f(3, 2): "]], ["text", ["insert", ["js", ["f"], function(f) {
    return f((3), (2));
}]]], ["element", "br", [], []], ["text", ["strvalue", "\n        embeddedTemplate:\n        "]], ["xmlcall", ["js", ["embeddedTemplate", "x"], function(embeddedTemplate, x) {
    return embeddedTemplate(x);
}]], ["text", ["strvalue", "\n    "]]]]];