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
});
