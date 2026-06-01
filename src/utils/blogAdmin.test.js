import { sanitizeRichHtml } from "./blogAdmin";

describe("sanitizeRichHtml", () => {
    it("removes executable markup and event handlers", () => {
        const result = sanitizeRichHtml('<img src="x" onerror="alert(1)"><script>alert(2)</script>');

        expect(result).not.toContain("onerror");
        expect(result).not.toContain("<script");
        expect(result).not.toContain("alert");
    });

    it("keeps safe links but blocks javascript urls", () => {
        const result = sanitizeRichHtml(
            '<a href="https://example.com" target="_blank">safe</a><a href="javascript:alert(1)">bad</a>'
        );

        expect(result).toContain('href="https://example.com"');
        expect(result).not.toContain("javascript:");
    });

    it("keeps safe Quill classes and inline color styles", () => {
        const result = sanitizeRichHtml(
            '<h4 class="ql-align-center ql-indent-1"><span style="color: rgb(230, 0, 0); background-color: #fff3cd; background-image: url(javascript:alert(1));">Title</span></h4>'
        );

        expect(result).toContain("<h4");
        expect(result).toContain("ql-align-center");
        expect(result).toContain("ql-indent-1");
        expect(result).toContain("color:");
        expect(result).toContain("background-color:");
        expect(result).not.toContain("background-image");
        expect(result).not.toContain("javascript:");
    });

    it("keeps trusted video embeds and removes untrusted iframes", () => {
        const result = sanitizeRichHtml(
            '<iframe src="https://www.youtube.com/embed/demo"></iframe><iframe src="https://example.com/embed/demo"></iframe>'
        );

        expect(result).toContain('src="https://www.youtube.com/embed/demo"');
        expect(result).toContain("ql-video");
        expect(result).toContain("sandbox=");
        expect(result).not.toContain("example.com/embed/demo");
    });
});
