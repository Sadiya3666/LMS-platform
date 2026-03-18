import { prisma } from './config/db';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('Seeding massive database...');

  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@eduflow.com' },
    update: {},
    create: { email: 'admin@eduflow.com', password_hash: passwordHash, name: 'Admin User' }
  });

  const studentHash = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@eduflow.com' },
    update: {},
    create: { email: 'student@eduflow.com', password_hash: studentHash, name: 'Demo Student' }
  });

  const domains = [
    { name: 'Programming', icon: '💻' },
    { name: 'Frontend', icon: '🎨' },
    { name: 'Backend', icon: '⚙️' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Design', icon: '✨' },
    { name: 'Database', icon: '🗄️' },
    { name: 'DevOps', icon: '🚀' },
    { name: 'Computer Science', icon: '🧠' }
  ];

  const coursesTemplate = [
    // Programming
    { title: 'Python for Professionals', category: 'Programming', slug: 'python-pro', instructor: 'Angela Yu', level: 'Intermediate', free: false, price: 1999, yt: 'rfscVS0vtbw' },
    { title: 'C++ Masterclass', category: 'Programming', slug: 'cpp-master', instructor: 'The Cherno', level: 'Advanced', free: false, price: 2499, yt: 'VAdGW7qjIsE' },
    { title: 'Java for Beginners', category: 'Programming', slug: 'java-basics', instructor: 'Mosh Hamedani', level: 'Beginner', free: true, price: 0, yt: 'eIrMblyqz8M' },
    { title: 'Golang Deep Dive', category: 'Programming', slug: 'golang-deep', instructor: 'Todd McLeod', level: 'Advanced', free: false, price: 2999, yt: 'YS4e4q9oBaU' },
    { title: 'Rust Systems Lab', category: 'Programming', slug: 'rust-lab', instructor: 'Jon Gjengset', level: 'Advanced', free: false, price: 3499, yt: 'msmXpE28c9Q' },
    { title: 'Swift for iOS', category: 'Programming', slug: 'swift-ios', instructor: 'Sean Allen', level: 'Beginner', free: false, price: 1599, yt: 'Ulp190wJ1O8' },
    { title: 'Kotlin Android Dev', category: 'Programming', slug: 'kotlin-android', instructor: 'Philipp Lackner', level: 'Intermediate', free: true, price: 0, yt: 'F9UC9DY-vIU' },
    { title: 'PHP & Laravel 11', category: 'Programming', slug: 'laravel-11', instructor: 'Jeffrey Way', level: 'Intermediate', free: false, price: 1299, yt: 'MYyJ4PuL4pY' },
    
    // Frontend
    { title: 'Tailwind CSS v4', category: 'Frontend', slug: 'tailwind-v4', instructor: 'Adam Wathan', level: 'Beginner', free: true, price: 0, yt: 'ft30zcMlFa8' },
    { title: 'Next.js 16 App Router', category: 'Frontend', slug: 'nextjs-16', instructor: 'Lee Robinson', level: 'Advanced', free: false, price: 1999, yt: 'wm5gMKuwSYk' },
    { title: 'Vue.js 3 Fundamentals', category: 'Frontend', slug: 'vue-3', instructor: 'Erik Hanchett', level: 'Beginner', free: true, price: 0, yt: 'bzlFvd0b65c' },
    { title: 'Three.js 3D Web', category: 'Frontend', slug: 'threejs-3d', instructor: 'Bruno Simon', level: 'Advanced', free: false, price: 3999, yt: 'xJAfLdUgdc4' },
    { title: 'SvelteKit Masterclass', category: 'Frontend', slug: 'sveltekit-pro', instructor: 'Rich Harris', level: 'Intermediate', free: false, price: 1799, yt: 'HAnmAnidI7A' },
    { title: 'Angular 18 Complete', category: 'Frontend', slug: 'angular-18', instructor: 'Maximilian', level: 'Intermediate', free: false, price: 2199, yt: '3qBXWUpoPHo' },
    { title: 'Framer Motion Magic', category: 'Frontend', slug: 'framer-motion', instructor: 'Sam Selikoff', level: 'Intermediate', free: true, price: 0, yt: 'v27Iu6GnYvI' },
    { title: 'Web Accessibility (a11y)', category: 'Frontend', slug: 'web-a11y', instructor: 'Marcy Sutton', level: 'Beginner', free: false, price: 999, yt: 'S5nOfJSTlFw' },

    // Backend
    { title: 'NestJS Pro Backend', category: 'Backend', slug: 'nestjs-pro', instructor: 'Marius Espejo', level: 'Advanced', free: false, price: 2599, yt: 'GHTA143_b-s' },
    { title: 'Express & Prisma', category: 'Backend', slug: 'express-prisma', instructor: 'Lama Dev', level: 'Intermediate', free: true, price: 0, yt: 'RebA5J-YRWU' },
    { title: 'Spring Boot 3.2', category: 'Backend', slug: 'spring-boot', instructor: 'Amigoscode', level: 'Advanced', free: false, price: 2999, yt: '9SGDpanrc8U' },
    { title: 'Django for SaaS', category: 'Backend', slug: 'django-saas', instructor: 'Dennis Ivy', level: 'Intermediate', free: false, price: 1899, yt: 'fSg-Y2S2e0M' },
    { title: 'Node.js Performance', category: 'Backend', slug: 'node-perf', instructor: 'Jack Herrington', level: 'Advanced', free: false, price: 2299, yt: 'Oe421EPjeBE' },
    { title: 'GraphQL Mastery', category: 'Backend', slug: 'graphql-master', instructor: 'Net Ninja', level: 'Intermediate', free: true, price: 0, yt: 'ed8Sz_K66pg' },
    { title: 'Microservices with Go', category: 'Backend', slug: 'go-micro', instructor: 'Nic Jackson', level: 'Advanced', free: false, price: 3499, yt: 'VAdGW7qjIsE' },
    { title: 'Redis Deep Dive', category: 'Backend', slug: 'redis-deep', instructor: 'Guy Royse', level: 'Advanced', free: false, price: 1499, yt: 'jgpVdJB2sKQ' },

    // Data Science
    { title: 'Pandas for Analysis', category: 'Data Science', slug: 'pandas-pro', instructor: 'Keith Galli', level: 'Intermediate', free: true, price: 0, yt: 'vmEHCJofslg' },
    { title: 'TensorFlow for AI', category: 'Data Science', slug: 'tensorflow-ai', instructor: 'Laurence Moroney', level: 'Advanced', free: false, price: 3999, yt: 'tPYj3fFJGjk' },
    { title: 'PyTorch Deep Learning', category: 'Data Science', slug: 'pytorch-dl', instructor: 'Daniel Bourke', level: 'Advanced', free: false, price: 4499, yt: 'V_xro1bcAuA' },
    { title: 'R for Data Science', category: 'Data Science', slug: 'r-ds', instructor: 'Hadley Wickham', level: 'Beginner', free: false, price: 1299, yt: 'fyfN9Xh7AAM' },
    { title: 'Data Cleaning Mastery', category: 'Data Science', slug: 'data-clean', instructor: 'Ken Jee', level: 'Intermediate', free: true, price: 0, yt: 'fyfN9Xh7AAM' },
    { title: 'Tableau Visualization', category: 'Data Science', slug: 'tableau-viz', instructor: 'Alex The Analyst', level: 'Beginner', free: false, price: 1599, yt: '7Jl-RwkzqQ4' },
    { title: 'Statistics for DS', category: 'Data Science', slug: 'stats-ds', instructor: 'Josh Starmer', level: 'Intermediate', free: false, price: 1799, yt: 'qBigTkBLU6g' },
    { title: 'NLP with Transformers', category: 'Data Science', slug: 'nlp-transformers', instructor: 'HuggingFace', level: 'Advanced', free: false, price: 4999, yt: 'tiZFewofSLM' },

    // Design
    { title: 'Figma 2024 Design', category: 'Design', slug: 'figma-2024', instructor: 'Mizko', level: 'Beginner', free: false, price: 2999, yt: 'FTFaQWCPqcu' },
    { title: 'UI Animation Principle', category: 'Design', slug: 'ui-animation', instructor: 'Pablo Stanley', level: 'Intermediate', free: true, price: 0, yt: 'vV_zR1U_cEY' },
    { title: 'Brand Identity Pro', category: 'Design', slug: 'brand-pro', instructor: 'Chris Do', level: 'Advanced', free: false, price: 4999, yt: 'FTFaQWCPqcu' },
    { title: 'Webflow Development', category: 'Design', slug: 'webflow-dev', instructor: 'Flux Academy', level: 'Intermediate', free: false, price: 2499, yt: '600_n62rSik' },
    { title: 'Adobe Illustrator Mastery', category: 'Design', slug: 'illustrator-pro', instructor: 'Deke McClelland', level: 'Beginner', free: false, price: 1899, yt: '600_n62rSik' },
    { title: 'UX Research Methods', category: 'Design', slug: 'ux-research', instructor: 'Nielsen Norman', level: 'Intermediate', free: true, price: 0, yt: 'S5nOfJSTlFw' },
    { title: 'Typography for Web', category: 'Design', slug: 'typography-web', instructor: 'Elliot Jay Stocks', level: 'Beginner', free: false, price: 1299, yt: '600_n62rSik' },
    { title: 'Spline 3D Design', category: 'Design', slug: 'spline-3d', instructor: 'Spline Team', level: 'Intermediate', free: false, price: 1599, yt: 'xJAfLdUgdc4' },

    // Database
    { title: 'PostgreSQL Advanced', category: 'Database', slug: 'postgres-adv', instructor: 'Hussein Nasser', level: 'Advanced', free: false, price: 2799, yt: 'zWCS9O8-vXk' },
    { title: 'MongoDB for Web', category: 'Database', slug: 'mongodb-web', instructor: 'Lama Dev', level: 'Intermediate', free: true, price: 0, yt: 'WDrU305J1yw' },
    { title: 'Elasticsearch Search', category: 'Database', slug: 'elasticsearch', instructor: 'TechWorld Nana', level: 'Advanced', free: false, price: 3299, yt: 'jgpVdJB2sKQ' },
    { title: 'SQLite in Production', category: 'Database', slug: 'sqlite-pro', instructor: 'Kent C. Dodds', level: 'Intermediate', free: false, price: 1499, yt: 'jgpVdJB2sKQ' },
    { title: 'Oracle DBA Basics', category: 'Database', slug: 'oracle-dba', instructor: 'Kaleb the Filmmaker', level: 'Beginner', free: false, price: 1999, yt: 'HXV3zeQKqGY' },
    { title: 'Firebase Masterclass', category: 'Database', slug: 'firebase-pro', instructor: 'Fireship', level: 'Intermediate', free: true, price: 0, yt: 'ed8Sz_K66pg' },
    { title: 'Cassandra Scaling', category: 'Database', slug: 'cassandra-scaling', instructor: 'DataStax', level: 'Advanced', free: false, price: 3999, yt: 'HXV3zeQKqGY' },
    { title: 'SQL Server Admin', category: 'Database', slug: 'sql-server', instructor: 'Praveen S', level: 'Intermediate', free: false, price: 2299, yt: 'HXV3zeQKqGY' },

    // DevOps
    { title: 'Kubernetes in Action', category: 'DevOps', slug: 'k8s-action', instructor: 'Nana Janashia', level: 'Advanced', free: false, price: 4499, yt: '3c-iBn7E8WM' },
    { title: 'AWS Cloud Practitioner', category: 'DevOps', slug: 'aws-cloud', instructor: 'Andrew Brown', level: 'Beginner', free: true, price: 0, yt: '3hLmDS179YE' },
    { title: 'Terraform Infrastructure', category: 'DevOps', slug: 'terraform', instructor: 'HashiCorp', level: 'Advanced', free: false, price: 3599, yt: 'h970ZjzovCU' },
    { title: 'GitHub Actions CI/CD', category: 'DevOps', slug: 'github-actions', instructor: 'James Ives', level: 'Intermediate', free: true, price: 0, yt: 'R8_veQiYBjI' },
    { title: 'Azure Administrator', category: 'DevOps', slug: 'azure-admin', instructor: 'John Savill', level: 'Intermediate', free: false, price: 2999, yt: 'X5s456gR6tA' },
    { title: 'Prometheus Monitoring', category: 'DevOps', slug: 'prometheus', instructor: 'Cloud Native', level: 'Advanced', free: false, price: 2499, yt: 'h970ZjzovCU' },
    { title: 'Ansible Automation', category: 'DevOps', slug: 'ansible-pro', instructor: 'Jeff Geerling', level: 'Intermediate', free: false, price: 1999, yt: 'h970ZjzovCU' },
    { title: 'Jenkins Pipeline', category: 'DevOps', slug: 'jenkins-cd', instructor: 'DevOps Directive', level: 'Intermediate', free: true, price: 0, yt: 'R8_veQiYBjI' },

    // Computer Science
    { title: 'CS50 Introduction', category: 'Computer Science', slug: 'cs50-intro', instructor: 'David J. Malan', level: 'Beginner', free: true, price: 0, yt: '8hly31xKli0' },
    { title: 'Binary & Hex Lab', category: 'Computer Science', slug: 'binary-lab', instructor: 'Ben Eater', level: 'Beginner', free: false, price: 999, yt: 's1iEessAFW0' },
    { title: 'Compiler Design', category: 'Computer Science', slug: 'compilers', instructor: 'Helsinki Univ', level: 'Advanced', free: false, price: 4999, yt: 'BBpAmxU_NQo' },
    { title: 'OS Kernel Dev', category: 'Computer Science', slug: 'os-kernel', instructor: 'Philip Opp', level: 'Advanced', free: false, price: 5499, yt: 'BBpAmxU_NQo' },
    { title: 'Networking Fundamentals', category: 'Computer Science', slug: 'networking', instructor: 'Eli the Computer Guy', level: 'Beginner', free: true, price: 0, yt: 'V_xro1bcAuA' },
    { title: 'Discrete Math for CS', category: 'Computer Science', slug: 'discrete-math', instructor: 'TrevTutor', level: 'Intermediate', free: false, price: 1499, yt: 'qBigTkBLU6g' },
    { title: 'Computer Architecture', category: 'Computer Science', slug: 'architecture', instructor: 'Onur Mutlu', level: 'Advanced', free: false, price: 3499, yt: 'BBpAmxU_NQo' },
    { title: 'Cryptography Pro', category: 'Computer Science', slug: 'crypto-pro', instructor: 'Computerphile', level: 'Advanced', free: false, price: 2999, yt: 'BBpAmxU_NQo' }
  ];

  for (const c of coursesTemplate) {
    const course = await prisma.subject.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        title: c.title,
        slug: c.slug,
        description: `This is a comprehensive course on ${c.title}. Master all the concepts with high-quality videos and assignments.`,
        is_published: true,
        thumbnail_url: `https://img.youtube.com/vi/${c.yt}/maxresdefault.jpg`,
        category: c.category,
        instructor_name: c.instructor,
        total_duration_seconds: 3600 * 5,
        difficulty_level: c.level,
        price: c.price,
        is_free: c.free,
        rating: 4.5 + Math.random() * 0.5,
        total_students: Math.floor(Math.random() * 5000)
      }
    });

    const sections = ['Introduction', 'Core Fundamentals', 'Advanced Topics', 'Final Project'];
    for (let i = 0; i < sections.length; i++) {
        const section = await prisma.section.upsert({
            where: { subject_id_order_index: { subject_id: course.id, order_index: i + 1 } },
            update: {},
            create: { subject_id: course.id, title: sections[i], order_index: i + 1 }
        });

        // Add 2 videos per section
        const videos = [
            { title: `${sections[i]} Part 1`, yt: c.yt, idx: 1 },
            { title: `${sections[i]} Part 2`, yt: c.yt, idx: 2 }
        ];

        for (const v of videos) {
            await prisma.video.upsert({
                where: { section_id_order_index: { section_id: section.id, order_index: v.idx } },
                update: {},
                create: {
                   section_id: section.id,
                   title: v.title,
                   youtube_url: `https://www.youtube.com/watch?v=${v.yt}`,
                   youtube_video_id: v.yt,
                   order_index: v.idx,
                   duration_seconds: 600,
                   description: `In this video, we dive into ${v.title}.`
                }
            });
        }
    }
  }

  console.log('Seeding complete! 64 Courses added (8 per domain).');
  console.log('Admin login: admin@eduflow.com / admin123');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
