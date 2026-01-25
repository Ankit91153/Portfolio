// Function to generate unique ID based on timestamp and random number
const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Raw projects data without IDs - add new projects at the top
const RAW_PROJECTS = [
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1769319115/gw5akd6gtbnp3zwk2nnf.png",
    isBlog: false,
    title: "QR Generator",
    description:
      "QR Generator is a flexible QR code creation tool that allows generating and customizing QR codes based on different requirements. The project supports two types of QR codes: Basic QR Code and Advanced QR Code.The Basic QR Code option generates a simple QR code without logos or text, making it lightweight and minimal for quick use.The Advanced QR Code option provides full customization, where a URL can be added along with configurable width, height, margin, colors, borders, and embedded logos. This allows creating visually customized QR codes suitable for branding or specific design needs.Generated QR codes can be downloaded in multiple formats, including PNG, JPEG, and JPG, making them easy to use across web, print, and digital platforms.This project is built as a practical utility for generating reusable and customizable QR codes with a clean and straightforward workflow.",
    ghLink: "https://github.com/Ankit91153/QRGenerator",
    demoLink: "https://qr-generator-ten-delta.vercel.app/",
    category: ["PWA", "Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/qr-generator",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1769318711/ljj96lcsojiqr9fo5srz.png",
    isBlog: false,
    title: "Image-Manager",
    description:
      "Image-Manager is a personal centralized asset storage system built to manage images, videos, PDFs, and documents in one place. It supports multiple file formats such as PNG, JPEG, JPG, videos, and PDFs, with all assets securely uploaded and stored on Cloudinary.For every uploaded file, the system generates a reusable public link that can be easily used across multiple personal projects. This eliminates the need to upload the same assets repeatedly and helps maintain a single, consistent source for all media and documents.The project is designed to simplify asset management during development by providing a reliable, cloud-based repository that improves workflow efficiency and project organization.",
    ghLink: "https://github.com/Ankit91153/image-manager-frontend",
    demoLink: "https://image-manager-frontend-eight.vercel.app",
    category: [ "Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/image-manager",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1769339222/lzbaugkztsabekgydunx.png",
    isBlog: false,
    title: "Smart Portfolio Chatbot Widget",
    description:
      "portfolio-chatbot-widget is a modern, embeddable, and fully customizable chatbot widget designed specifically for developer portfolios and personal websites. It allows anyone to add an AI-powered chatbot to their portfolio that answers questions based on their own profile, projects, and content.The workflow is simple: users visit the main platform, sign up, create a new chatbot, and configure it using their portfolio details. Once configured, they can install the npm package in their React or Next.js project, connect it using their chatbot credentials, and instantly enable a smart chatbot on their website.The widget supports complete dynamic color customization with no theme limitations, making it easy to match any portfolio design. It is lightweight, easy to integrate, and built with TypeScript, providing full type safety out of the box.This package is ideal for developers who want to showcase their work interactively, allowing visitors to ask questions and get instant, AI-powered responses tailored to their portfolio.",
    ghLink: "https://github.com/Ankit91153/portfolio-chatbot-widget#readme",
    demoLink: "https://www.npmjs.com/package/portfolio-chatbot-widget",
    category: ["NPM Package"],
    aboutLink: "https://www.npmjs.com/package/portfolio-chatbot-widget",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1769339066/pn1qyu7niwxqghhr1lny.png",
    isBlog: false,
    title: "Smart Portfolio Chatbot Platform",
    description:
      "Smart Portfolio Chatbot is a web-based platform that allows developers to create AI-powered chatbots tailored specifically to their personal portfolios and websites. Through a simple and intuitive dashboard, users can sign up, create a new chatbot, and configure it using their portfolio information, projects, skills, and custom responses.Once the chatbot is created, the platform generates the required credentials and configuration that can be seamlessly used with the portfolio-chatbot-widget npm package. This enables developers to embed their personalized chatbot into any React or Next.js website with minimal setup.The platform is designed to give full control over chatbot behavior and appearance, including dynamic customization options such as colors and styling, ensuring the chatbot blends perfectly with any portfolio design. It acts as the central management system where chatbots are created, updated, and maintained, while the npm package handles the frontend embedding.Smart Portfolio Chatbot helps developers present their work in an interactive and engaging way, allowing visitors to ask questions and receive instant, AI-driven responses based on the developer's own portfolio content.",
    ghLink: "https://github.com/Ankit91153/portfolio-chatbot",
    demoLink: "https://portfolio-chatbot-omega-one.vercel.app/",
    category: ["Website", "AI"],
    aboutLink: "https://www.npmjs.com/package/portfolio-chatbot-widget",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041350/qf4fpey3pz1pe5ij4kv3.png",
    isBlog: false,
    title: "AnkitVerse – Dev Blogs",
    description:
      "AnkitVerse is a developer-focused blogging platform where users can explore real-world coding issues and common challenges faced when starting out with programming. Each blog provides step-by-step explanations to help readers understand and solve problems efficiently. Users can create personalized profiles, add comments to posts, and engage with the community. The platform also highlights the latest blog updates to keep content fresh and relevant. Built using the powerful MERN stack, AnkitVerse offers a seamless experience for both readers and writers. It's an ideal space to learn, share knowledge, and grow as a developer.",
    ghLink: "https://github.com/Ankit91153/blog-frontend",
    demoLink: "https://ankit-verse.vercel.app/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/ankitverse-platform",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041197/ajhsj3h4ft05ov6za5lf.png",
    isBlog: false,
    title: "AI Content Generator Pro",
    description:
      "Experience our cutting-edge AI-powered content generator that crafts compelling content across diverse niches—whether it's YouTube keyword ideas, coding snippets, engaging blog posts, or precise blog niche content. Enjoy a free track of up to 10,000 words with full history tracking, and continue generating content beyond that for only $9/₹9 via Razorpay. Dive into a practical learning journey: understand how AI engines generate creative content and explore the seamless integration of payment gateways within a robust MERN stack architecture.",
    ghLink: "https://github.com/Ankit91153/ai-generator-content",
    demoLink: "https://ai-generator-content-rbtq.vercel.app/",
    category: ["PWA", "Website", "AI"],
    aboutLink: "https://ankit-verse.vercel.app/blog/ai-content-generator",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041509/utlvsqmuvyn73veu11gt.png",
    isBlog: false,
    title: "StudyNotion",
    description:
      "Introducing our versatile project with admin, instructor, and student panels. Admin manages categories, instructors handle courses with React pie charts, and students enjoy Razorpay-integrated course purchases. Powered by MERN Stack.",
    ghLink: "https://github.com/Ankit91153/studynotion",
    demoLink: "https://studynotion-lemon.vercel.app/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/studynotion",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041417/wud0r7pcwc0cb7jigscy.png",
    isBlog: false,
    title: "AddNote",
    description:
      "Crafted a sleek note-taking app using MERN stack. Implemented features like user authentication and real-time updates. Demonstrated proficiency in JavaScript, React, Node.js, Express, and MongoDB.",
    ghLink: "https://github.com/Ankit91153/mininotesforntend",
    demoLink: "https://mininotesapp.netlify.app/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/notes-app",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041562/eyvfc9mm1jjcwmmmfdbd.png",
    isBlog: false,
    title: "Youtube",
    description:
      "2023 YouTube clone || This project is a front-end clone of the popular video-sharing platform, YouTube. It aims to recreate the familiar and user-friendly interface of YouTube, allowing users to browse, search, and watch videos seamlessly.",
    ghLink: "https://github.com/Ankit91153/youTube-Lite",
    demoLink: "https://you-tube-lite.netlify.app",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/youtube-clone",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041456/kemo7h4z5xqssx4fmuxd.png",
    isBlog: false,
    title: "Netflix",
    description:
      "A Netflix clone project is a web application or mobile app that replicates the functionality and features of the original Netflix platform. The project involves creating a user-friendly interface .",
    ghLink: "https://github.com/Ankit91153/netflixClone",
    demoLink: "https://ankit91153.github.io/netflixClone/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/netflix-clone",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041538/pdyximhyguphvnsmpfpu.png",
    isBlog: false,
    title: "Weather Website",
    description:
      "I was tired of going out and seeing what the weather was like outside. Tired of using the google weather application. This simple weather application will only display the current weather for a given area.",
    ghLink: "https://github.com/Ankit91153/weatherApp",
    demoLink: "https://weather-app-by-ankit.onrender.com/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/weather-app",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041390/zbgzybfaysmsabnuyaoo.png",
    isBlog: false,
    title: "Add-To-Cart",
    description:
      "Shopping cart app built with React and React-Toolkit. This app is a clone of react javascript ecommerce  shopping-cart ....",
    ghLink: "https://github.com/Ankit91153/e-commerce-website",
    demoLink: "https://e-commerce-website-react-nine.vercel.app/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/ecommerce-cart",
  },
  {
    imgPath:
      "https://res.cloudinary.com/dnbtptnhj/image/upload/v1745041482/z1006ufzsxryb1dflyjx.png",
    isBlog: false,
    title: "Guess Number",
    description:
      "The game is to guess a random number generated by a computer in the range 1 – 100 in a minimum number of Guesses.",
    ghLink: "https://github.com/Ankit91153/Number-Guesses-Game",
    demoLink: "https://ankit91153.github.io/Number-Guesses-Game/",
    category: ["Website"],
    aboutLink: "https://ankit-verse.vercel.app/blog/guess-number-game",
  },
];

// Automatically generate IDs for projects (newest projects get lower IDs for top positioning)
export const PROJECTS = RAW_PROJECTS.map((project, index) => ({
  ...project,
  id: generateUniqueId() + index, // Ensures unique IDs
}));

export const TITLE1 = "My Recent";
export const TITLE2 = "Works";
export const DESCRIPTION = "Here are a few projects I've worked on recently.";

export const CATEGORIES = ["All", "Website", "PWA", "Mobile App", "NPM Package", "AI"];