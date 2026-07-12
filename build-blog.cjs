const fs = require('fs');
const path = require('path');

// Read existing blog
const blog = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/lib/content/blog.i18n.json'), 'utf8'));

// Add categories
const categoryMap = { guide: 'Guides', comparison: 'Comparisons', 'case-study': 'Case Studies' };
const catMapAr = { guide: 'أدلة', comparison: 'مقارنات', 'case-study': 'دراسات حالة' };

// Assign categories to existing posts
const catAssign = {
  'website-cost-saudi-arabia': 'guide',
  'shopify-vs-salla': 'comparison',
  'salla-seo-guide': 'guide'
};

blog.en.categories = categoryMap;
blog.ar.categories = catMapAr;

blog.en.posts.forEach(p => { p.category = catAssign[p.slug] || 'guide'; });
blog.ar.posts.forEach(p => { p.category = catAssign[p.slug] || 'guide'; });

console.log('Categories added to existing posts:', blog.en.posts.length);

fs.writeFileSync(path.join(__dirname, 'src/lib/content/blog.i18n.json'), JSON.stringify(blog, null, 2), 'utf8');
console.log('Done');
