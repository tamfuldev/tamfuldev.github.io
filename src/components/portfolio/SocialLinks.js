import {
    FaFacebookF,
    FaGithub,
    FaLinkedinIn,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";
import { socialLinks } from "../../data/portfolioContent";

const socialIcons = {
    facebook: FaFacebookF,
    github: FaGithub,
    linkedin: FaLinkedinIn,
    youtube: FaYoutube,
    twitter: FaTwitter
};

const SocialLinks = ({ compact = false, className = "" }) => (
    <div className={`portfolio-social-links${compact ? " is-compact" : ""}${className ? ` ${className}` : ""}`}>
        {socialLinks.map((social) => {
            const Icon = socialIcons[social.id] || FaGithub;

            return (
                <a
                    aria-label={social.label}
                    className="portfolio-social-link"
                    href={social.url}
                    key={social.id}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={social.label}
                >
                    <Icon />
                    {!compact && <span>{social.label}</span>}
                </a>
            );
        })}
    </div>
);

export default SocialLinks;
