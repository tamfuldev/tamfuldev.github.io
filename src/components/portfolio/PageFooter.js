import SocialLinks from "./SocialLinks";

const PageFooter = ({ children }) => (
    <footer className="portfolio-footer">
        <div>{children}</div>
        <SocialLinks compact className="portfolio-footer-socials" />
    </footer>
);

export default PageFooter;
