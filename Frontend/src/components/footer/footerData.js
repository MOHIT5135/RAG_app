import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import {
  MdEmail,
  MdCall,
  MdLocationOn,
} from "react-icons/md";

export const footerLinks = [
  {
    title: "Product",

    links: [
      {
        name: "Features",
        href: "#features",
      },
      {
        name: "How It Works",
        href: "#how-it-works",
      },
      {
        name: "Use Cases",
        href: "#use-cases",
      },
      {
        name: "Technology",
        href: "#tech-stack",
      },
    ],
  },

  {
    title: "Resources",

    links: [
      {
        name: "Documentation",
        href: "#",
      },
      {
        name: "GitHub",
        href: "https://github.com/amitsain001",
      },
      {
        name: "API",
        href: "#",
      },
    ],
  },

  {
    title: "Company",

    links: [
      {
        name: "About",
        href: "#",
      },
      {
        name: "Privacy Policy",
        href: "#",
      },
      {
        name: "Terms & Conditions",
        href: "#",
      },
    ],
  },
];

export const contacts = [
  {
    icon: MdEmail,

    title: "Email",

    value: "amit2976297@gmail.com / mohitk87975@gmail.com",

    href: "mailto:amit2976297@gmail.com",
  },

  {
    icon: MdCall,

    title: "Phone",

    value: "+91 96108 41282 / +91 96365 68730",

    href: "tel:+91 96108 41282",
  },

  {
    icon: MdLocationOn,

    title: "Location",

    value: "Rajasthan, India",

    href: "#",
  },
];

// export const socials = [
//   {
//     icon: FaGithub,

//     href: "https://github.com/amitsain001",

//     label: "GitHub",
//   },

//   {
//     icon: FaLinkedin,

//     href: "https://www.linkedin.com/in/amit-sain-281a02309/",

//     label: "LinkedIn",
//   },
// ];