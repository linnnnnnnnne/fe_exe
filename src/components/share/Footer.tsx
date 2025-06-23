"use client";

import * as React from "react";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = "",
}) => {
  return (
    <a
      href={href}
      className={`text-base no-underline text-zinc-500 hover:text-zinc-300 transition-colors ${className}`}
    >
      {children}
    </a>
  );
};

interface FooterLink {
  text: string;
  href: string;
  className?: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

const FooterColumn: React.FC<FooterColumnProps> = ({
  title,
  links,
  className = "",
}) => {
  return (
    <section className={`w-3/12 max-md:ml-0 max-md:w-full ${className}`}>
      <nav className="flex flex-col items-start text-base text-zinc-500 max-md:mt-10">
        <h2 className="font-bold text-white">{title}</h2>
        {links.map((link, index) => (
          <FooterLink
            key={index}
            href={link.href}
            className={`mt-5 ${link.className || ""}`}
          >
            {link.text}
          </FooterLink>
        ))}
      </nav>
    </section>
  );
};

const Footer: React.FC = () => {
  const infoLinks = [
    { text: "About Us", href: "/about" },
    { text: "Support", href: "/support" },
    { text: "Blog", href: "/blog", className: "text-lg leading-relaxed" },
    {
      text: "Download Apps",
      href: "/downloads",
      className: "self-stretch max-md:mr-2.5",
    },
    { text: "The Slack App", href: "/slack" },
    { text: "Partnerships", href: "/partnerships" },
    {
      text: "Affiliate Program",
      href: "/affiliates",
      className: "self-stretch",
    },
  ];

  const featureLinks = [
    { text: "Invoicing", href: "/features/invoicing" },
    {
      text: "Task Management",
      href: "/features/task-management",
      className: "self-stretch max-md:mr-2.5",
    },
    { text: "Contracts", href: "/features/contracts" },
    { text: "Payments", href: "/features/payments" },
    {
      text: "Recurring payments",
      href: "/features/recurring-payments",
      className: "self-stretch",
    },
    { text: "Expense Tracking", href: "/features/expense-tracking" },
    { text: "Reports", href: "/features/reports" },
    { text: "Proposals", href: "/features/proposals" },
    { text: "Time Tracking", href: "/features/time-tracking" },
  ];

  const helpfulLinks = [
    { text: "Williams & Harricks", href: "/partners/williams-harricks" },
    { text: "Anywhere Workers", href: "/anywhere-workers" },
    {
      text: "Freshbooks Alternative",
      href: "/vs/freshbooks",
      className: "self-stretch max-md:mr-1",
    },
    {
      text: "Quickbooks Alternative",
      href: "/vs/quickbooks",
      className: "self-stretch",
    },
    { text: "Harvest Alternative", href: "/vs/harvest" },
    {
      text: "Wave Apps Alternative",
      href: "/vs/wave-apps",
      className: "self-stretch max-md:mr-0.5",
    },
    { text: "Design DB", href: "/design-db" },
  ];

  const policyLinks = [
    { text: "Terms of Service", href: "/terms", className: "self-stretch" },
    { text: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer>
      <div className="flex flex-col pt-10 pb-4 w-full bg-teal max-md:max-w-full font-montserrat">
        <div className="self-center w-full max-w-[1144px] pl-20 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <FooterColumn title="Info" links={infoLinks} />
            <FooterColumn
              title="Features"
              links={featureLinks}
              className="ml-5"
            />
            <FooterColumn
              title="Helpful Links"
              links={helpfulLinks}
              className="ml-5"
            />
            <FooterColumn
              title="Policies"
              links={policyLinks}
              className="ml-5"
            />
          </div>
        </div>
        <div className="w-full relative border-gainsboro-100 border-solid border-t-[1.2px] box-border h-[15px] mt-10" />
      </div>
    </footer>
  );
};

export default Footer;
