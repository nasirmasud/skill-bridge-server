import { hashPassword } from "../src/lib/bcrypt";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Clearing existing demo data...");

  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");

  const password = await hashPassword("Password123!");

  const admin = await prisma.user.create({
    data: {
      name: "Skillbridge Admin",
      email: "admin@skillbridge.com",
      password,
      role: "ADMIN",
    },
  });

  const rakib = await prisma.user.create({
    data: {
      name: "Rakib Hasan",
      email: "rakib@example.com",
      password,
      role: "FREELANCER",
      phone: "+8801711111111",
      bio: "Full-stack developer with 6+ years building React and Node.js applications.",
      profileImg: "https://i.pravatar.cc/150?img=11",
    },
  });

  const sadia = await prisma.user.create({
    data: {
      name: "Sadia Rahman",
      email: "sadia@example.com",
      password,
      role: "FREELANCER",
      phone: "+8801722222222",
      bio: "UI/UX designer crafting clean, modern interfaces and brand identities.",
      profileImg: "https://i.pravatar.cc/150?img=47",
    },
  });

  const tanvir = await prisma.user.create({
    data: {
      name: "Tanvir Ahmed",
      email: "tanvir@example.com",
      password,
      role: "FREELANCER",
      phone: "+8801733333333",
      bio: "SEO content writer and digital marketer helping brands grow online.",
      profileImg: "https://i.pravatar.cc/150?img=12",
    },
  });

  const nusrat = await prisma.user.create({
    data: {
      name: "Nusrat Jahan",
      email: "nusrat@example.com",
      password,
      role: "CLIENT",
      phone: "+8801744444444",
    },
  });

  const mehedi = await prisma.user.create({
    data: {
      name: "Mehedi Hasan",
      email: "mehedi@example.com",
      password,
      role: "CLIENT",
      phone: "+8801755555555",
    },
  });

  const farhan = await prisma.user.create({
    data: {
      name: "Farhan Karim",
      email: "farhan@example.com",
      password,
      role: "CLIENT",
      phone: "+8801766666666",
    },
  });

  console.log("Seeding categories...");

  const web = await prisma.category.create({
    data: {
      name: "Web Development",
      description: "Websites, apps and APIs built by expert developers.",
      icon: "Code2",
    },
  });

  const design = await prisma.category.create({
    data: {
      name: "Graphics & Design",
      description: "Logos, brand identity and UI design that stand out.",
      icon: "Palette",
    },
  });

  const writing = await prisma.category.create({
    data: {
      name: "Writing & Translation",
      description: "Articles, copy and translations that connect with readers.",
      icon: "PenTool",
    },
  });

  const marketing = await prisma.category.create({
    data: {
      name: "Digital Marketing",
      description: "Grow your brand with ads, SEO and social media.",
      icon: "TrendingUp",
    },
  });

  const video = await prisma.category.create({
    data: {
      name: "Video & Animation",
      description: "Engaging videos, motion graphics and editing.",
      icon: "Video",
    },
  });

  const business = await prisma.category.create({
    data: {
      name: "Business",
      description: "Consulting, finance and business support services.",
      icon: "Briefcase",
    },
  });

  console.log("Seeding services...");

  const s1 = await prisma.service.create({
    data: {
      title: "I will build a responsive React website",
      description:
        "A fully responsive, modern single-page application built with React and Tailwind CSS. Includes clean component architecture, SEO meta tags, and a fast Lighthouse score.",
      price: 4500,
      deliveryDays: 5,
      thumbnail: "https://picsum.photos/seed/web-react/600/400",
      gallery: [
        "https://picsum.photos/seed/web-react-1/600/400",
        "https://picsum.photos/seed/web-react-2/600/400",
        "https://picsum.photos/seed/web-react-3/600/400",
      ],
      tools: ["React", "Tailwind CSS", "TypeScript", "Vite"],
      highlights: [
        "Responsive on all devices",
        "SEO Optimized",
        "Fast Loading Speed",
        "Clean & Modern Design",
        "Unlimited Revisions",
        "24/7 Support",
      ],
      whatYouGet: [
        "Up to 5 Pages",
        "Responsive Design",
        "Contact Form",
        "Basic SEO",
        "Delivery in 5 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 5 Pages",
        "Responsive Design",
        "Contact Form",
        "Basic SEO",
        "Delivery in 5 Days",
      ],
      status: "ACTIVE",
      categoryId: web.id,
      freelancerId: rakib.id,
    },
  });

  const s2 = await prisma.service.create({
    data: {
      title: "I will develop a full-stack Node.js REST API",
      description:
        "Production-ready REST API with Express, Prisma and PostgreSQL. Includes JWT authentication, input validation, soft deletes and clear error handling.",
      price: 8000,
      deliveryDays: 7,
      thumbnail: "https://picsum.photos/seed/api-node/600/400",
      gallery: [
        "https://picsum.photos/seed/api-node-1/600/400",
        "https://picsum.photos/seed/api-node-2/600/400",
      ],
      tools: ["Node.js", "Express", "Prisma", "PostgreSQL", "JWT"],
      highlights: [
        "Secure Authentication",
        "RESTful API Design",
        "Input Validation",
        "Clear Error Handling",
        "Database with Prisma",
      ],
      whatYouGet: [
        "REST API Endpoints",
        "JWT Authentication",
        "Database Schema",
        "API Documentation",
        "Delivery in 7 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 10 Endpoints",
        "JWT Authentication",
        "Database Schema",
        "API Documentation",
        "Delivery in 7 Days",
      ],
      status: "ACTIVE",
      categoryId: web.id,
      freelancerId: rakib.id,
    },
  });

  const s3 = await prisma.service.create({
    data: {
      title: "I will create a complete e-commerce store",
      description:
        "A full online store with product catalog, cart, secure checkout and admin panel. Mobile-first and optimized for conversions.",
      price: 12000,
      deliveryDays: 10,
      thumbnail: "https://picsum.photos/seed/ecommerce/600/400",
      gallery: [
        "https://picsum.photos/seed/ecommerce-1/600/400",
        "https://picsum.photos/seed/ecommerce-2/600/400",
        "https://picsum.photos/seed/ecommerce-3/600/400",
      ],
      tools: ["React", "Node.js", "Stripe", "PostgreSQL"],
      highlights: [
        "Product Catalog",
        "Shopping Cart",
        "Secure Checkout",
        "Admin Panel",
        "Mobile-First",
      ],
      whatYouGet: [
        "Product Catalog",
        "Shopping Cart",
        "Secure Checkout",
        "Admin Panel",
        "Delivery in 10 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 20 Products",
        "Shopping Cart",
        "Secure Checkout",
        "Admin Panel",
        "Delivery in 10 Days",
      ],
      status: "ACTIVE",
      categoryId: web.id,
      freelancerId: rakib.id,
    },
  });

  const s4 = await prisma.service.create({
    data: {
      title: "I will design a modern UI for your web or mobile app",
      description:
        "Clean, conversion-focused interface design delivered in Figma. Includes a design system, reusable components and a clickable prototype.",
      price: 3000,
      deliveryDays: 3,
      thumbnail: "https://picsum.photos/seed/ui-design/600/400",
      gallery: [
        "https://picsum.photos/seed/ui-design-1/600/400",
        "https://picsum.photos/seed/ui-design-2/600/400",
      ],
      tools: ["Figma", "Design System", "Prototyping"],
      highlights: [
        "Clean & Modern Design",
        "Design System",
        "Reusable Components",
        "Clickable Prototype",
      ],
      whatYouGet: [
        "Design System",
        "Reusable Components",
        "Clickable Prototype",
        "Handoff-Ready Specs",
        "Delivery in 3 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 5 Screens",
        "Design System",
        "Reusable Components",
        "Clickable Prototype",
        "Delivery in 3 Days",
      ],
      status: "ACTIVE",
      categoryId: design.id,
      freelancerId: sadia.id,
    },
  });

  const s5 = await prisma.service.create({
    data: {
      title: "I will create a brand identity and logo design",
      description:
        "A memorable logo plus a mini brand kit with color palette, typography and usage guidelines across print and digital.",
      price: 2500,
      deliveryDays: 4,
      thumbnail: "https://picsum.photos/seed/branding/600/400",
      gallery: [
        "https://picsum.photos/seed/branding-1/600/400",
        "https://picsum.photos/seed/branding-2/600/400",
      ],
      tools: ["Illustrator", "Photoshop", "Brand Guidelines"],
      highlights: [
        "Memorable Logo",
        "Color Palette",
        "Typography",
        "Usage Guidelines",
      ],
      whatYouGet: [
        "Logo Design",
        "Color Palette",
        "Typography",
        "Brand Guidelines",
        "Delivery in 4 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Logo Design",
        "Color Palette",
        "Typography",
        "Usage Guidelines",
        "Delivery in 4 Days",
      ],
      status: "ACTIVE",
      categoryId: design.id,
      freelancerId: sadia.id,
    },
  });

  const s6 = await prisma.service.create({
    data: {
      title: "I will design mobile app screens in Figma",
      description:
        "Pixel-perfect mobile app screens with a consistent design system, dark mode support and handoff-ready specs.",
      price: 5000,
      deliveryDays: 5,
      thumbnail: "https://picsum.photos/seed/mobile-app/600/400",
      gallery: [
        "https://picsum.photos/seed/mobile-app-1/600/400",
        "https://picsum.photos/seed/mobile-app-2/600/400",
        "https://picsum.photos/seed/mobile-app-3/600/400",
      ],
      tools: ["Figma", "Design System", "Dark Mode"],
      highlights: [
        "Pixel-Perfect Screens",
        "Consistent Design System",
        "Dark Mode Support",
        "Handoff-Ready Specs",
      ],
      whatYouGet: [
        "Mobile App Screens",
        "Design System",
        "Dark Mode Support",
        "Handoff-Ready Specs",
        "Delivery in 5 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 8 Screens",
        "Design System",
        "Dark Mode Support",
        "Handoff-Ready Specs",
        "Delivery in 5 Days",
      ],
      status: "ACTIVE",
      categoryId: design.id,
      freelancerId: sadia.id,
    },
  });

  const s7 = await prisma.service.create({
    data: {
      title: "I will write SEO-optimized blog posts",
      description:
        "Research-backed, keyword-optimized articles that rank on Google and read naturally. Includes meta titles, descriptions and content outlines.",
      price: 1200,
      deliveryDays: 2,
      thumbnail: "https://picsum.photos/seed/blog-writing/600/400",
      gallery: [
        "https://picsum.photos/seed/blog-writing-1/600/400",
        "https://picsum.photos/seed/blog-writing-2/600/400",
      ],
      tools: ["SEO Research", "Content Strategy", "Keyword Optimization"],
      highlights: [
        "Keyword-Optimized",
        "Ranks on Google",
        "Reads Naturally",
        "Meta Titles & Descriptions",
      ],
      whatYouGet: [
        "Research-Backed Articles",
        "Keyword Optimization",
        "Meta Titles & Descriptions",
        "Content Outline",
        "Delivery in 2 Days",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 1000 Words",
        "Keyword Optimization",
        "Meta Titles & Descriptions",
        "Content Outline",
        "Delivery in 2 Days",
      ],
      status: "ACTIVE",
      categoryId: writing.id,
      freelancerId: tanvir.id,
    },
  });

  const s8 = await prisma.service.create({
    data: {
      title: "I will set up and run a Facebook ad campaign",
      description:
        "End-to-end Facebook and Instagram ads: audience research, creative, targeting, tracking pixel setup and weekly performance reports.",
      price: 6000,
      deliveryDays: 10,
      thumbnail: "https://picsum.photos/seed/fb-ads/600/400",
      gallery: [
        "https://picsum.photos/seed/fb-ads-1/600/400",
        "https://picsum.photos/seed/fb-ads-2/600/400",
      ],
      tools: ["Meta Ads Manager", "Audience Research", "Pixel Setup"],
      highlights: [
        "Audience Research",
        "Ad Creative",
        "Targeting",
        "Tracking Pixel Setup",
        "Weekly Reports",
      ],
      whatYouGet: [
        "Audience Research",
        "Ad Creative",
        "Targeting",
        "Tracking Pixel Setup",
        "Weekly Performance Reports",
      ],
      packageName: "Basic Package",
      packageFeatures: [
        "Up to 2 Ad Sets",
        "Ad Creative",
        "Targeting",
        "Pixel Setup",
        "Weekly Reports",
      ],
      status: "ACTIVE",
      categoryId: marketing.id,
      freelancerId: tanvir.id,
    },
  });

  console.log("Seeding orders...");

  const o1 = await prisma.order.create({
    data: {
      status: "COMPLETED",
      totalPrice: s1.price,
      requirement: "I need a portfolio site with 5 pages.",
      clientId: nusrat.id,
      serviceId: s1.id,
    },
  });

  const o2 = await prisma.order.create({
    data: {
      status: "COMPLETED",
      totalPrice: s2.price,
      requirement: "I need a REST API for a small inventory system.",
      clientId: mehedi.id,
      serviceId: s2.id,
    },
  });

  const o3 = await prisma.order.create({
    data: {
      status: "IN_PROGRESS",
      totalPrice: s7.price,
      requirement: "3 SEO blog posts about React performance.",
      clientId: nusrat.id,
      serviceId: s7.id,
    },
  });

  const o4 = await prisma.order.create({
    data: {
      status: "PENDING",
      totalPrice: s6.price,
      requirement: "Mobile screens for a food delivery app.",
      clientId: mehedi.id,
      serviceId: s6.id,
    },
  });

  const o5 = await prisma.order.create({
    data: {
      status: "CANCELLED",
      totalPrice: s3.price,
      requirement: "E-commerce store with payment gateway.",
      clientId: farhan.id,
      serviceId: s3.id,
    },
  });

  const o6 = await prisma.order.create({
    data: {
      status: "IN_PROGRESS",
      totalPrice: s4.price,
      requirement: "UI design for a SaaS dashboard.",
      clientId: farhan.id,
      serviceId: s4.id,
    },
  });

  const o7 = await prisma.order.create({
    data: {
      status: "ACCEPTED",
      totalPrice: s5.price,
      requirement: "Logo and brand kit for my startup.",
      clientId: nusrat.id,
      serviceId: s5.id,
    },
  });

  const o8 = await prisma.order.create({
    data: {
      status: "PENDING",
      totalPrice: s8.price,
      requirement: "Facebook ads for a 30-day campaign.",
      clientId: mehedi.id,
      serviceId: s8.id,
    },
  });

  console.log("Seeding reviews...");

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Great work, delivered on time!",
      clientId: nusrat.id,
      serviceId: s1.id,
      orderId: o1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: "Solid API, clear communication throughout.",
      clientId: mehedi.id,
      serviceId: s2.id,
      orderId: o2.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
