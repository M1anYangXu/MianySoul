import { prisma } from "./src/db/index.js";

async function main() {
  const articles = await prisma.article.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });

  console.log("文章列表（原始数据）:");
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   createdAt: ${article.createdAt}`);
    console.log(`   updatedAt: ${article.updatedAt}`);
  });

  console.log("\n文章列表（按createdAt倒序）:");
  const sortedArticles = await prisma.article.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });
  sortedArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title} - ${article.createdAt}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
