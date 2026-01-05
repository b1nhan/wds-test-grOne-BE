import dotenv from 'dotenv';
dotenv.config();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import fs from 'fs';

// Khởi tạo adapter với cấu hình database
let adapter;
try {
  // Thử dùng SSL nếu có file ca.pem
  if (fs.existsSync('./ca.pem')) {
    adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: false,
      },
      connectionLimit: 10,
    });
  } else {
    // Nếu không có SSL, tạo adapter không SSL
    adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    });
  }
} catch (error) {
  console.error('Lỗi khi khởi tạo adapter:', error);
  throw error;
}

// Khởi tạo PrismaClient với adapter
const prisma = new PrismaClient({ adapter });

// Dữ liệu mock cho các sản phẩm giày
const shoesData = [
  {
    name: "Nike Air Max 90",
    price: 3500000,
    description: "Giày thể thao Nike Air Max 90 cổ điển với đệm khí Air Max, thiết kế retro phong cách. Chất liệu da và lưới cao cấp, đế ngoài bền bỉ.",
    quantity: 50,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
  {
    name: "Adidas Ultraboost 22",
    price: 4200000,
    description: "Giày chạy bộ Adidas Ultraboost với công nghệ Boost, đệm êm ái và phản hồi năng lượng. Phù hợp cho chạy đường dài và tập luyện.",
    quantity: 35,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
  },
  {
    name: "Converse Chuck Taylor All Star",
    price: 1500000,
    description: "Giày Converse cổ điển, thiết kế đơn giản và phong cách. Phù hợp cho mọi dịp, từ đi chơi đến đi làm. Nhiều màu sắc đa dạng.",
    quantity: 100,
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500"
  },
  {
    name: "Vans Old Skool",
    price: 1800000,
    description: "Giày Vans Old Skool với thiết kế iconic, dải vạch bên hông. Chất liệu canvas và suede, đế waffle chống trượt. Phong cách streetwear.",
    quantity: 75,
    imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500"
  },
  {
    name: "Puma Suede Classic",
    price: 2000000,
    description: "Giày Puma Suede với chất liệu da lộn mềm mại, thiết kế cổ điển. Phù hợp cho thời trang đường phố và thể thao nhẹ.",
    quantity: 60,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
  },
  {
    name: "Nike Dunk Low",
    price: 3200000,
    description: "Giày Nike Dunk Low với thiết kế bóng rổ cổ điển, nhiều phiên bản màu sắc. Chất liệu da cao cấp, đế cao su bền bỉ.",
    quantity: 40,
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2aeb165?w=500"
  },
  {
    name: "Adidas Stan Smith",
    price: 2200000,
    description: "Giày Adidas Stan Smith cổ điển, thiết kế tối giản với da trắng và đế xanh. Phù hợp cho mọi dịp, từ casual đến semi-formal.",
    quantity: 80,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
  },
  {
    name: "New Balance 550",
    price: 2800000,
    description: "Giày New Balance 550 với thiết kế retro, đệm ABZORB êm ái. Chất liệu da và lưới, phù hợp cho đi bộ và thể thao nhẹ.",
    quantity: 55,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
  },
  {
    name: "Jordan 1 Retro High",
    price: 5500000,
    description: "Giày bóng rổ Air Jordan 1 Retro High, thiết kế huyền thoại. Chất liệu da cao cấp, nhiều phiên bản màu sắc iconic.",
    quantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500"
  },
  {
    name: "Reebok Classic Leather",
    price: 1900000,
    description: "Giày Reebok Classic Leather với thiết kế cổ điển, chất liệu da mềm mại. Đệm êm ái, phù hợp cho đi bộ hàng ngày.",
    quantity: 65,
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500"
  },
  {
    name: "Nike Air Force 1",
    price: 2800000,
    description: "Giày Nike Air Force 1 với thiết kế bóng rổ cổ điển, đệm Air-Sole. Chất liệu da trắng, phù hợp cho mọi phong cách.",
    quantity: 90,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
  },
  {
    name: "Adidas Samba",
    price: 2400000,
    description: "Giày Adidas Samba với thiết kế bóng đá cổ điển, đế gum. Chất liệu da và suede, phong cách retro và thể thao.",
    quantity: 70,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
];

async function main() {
  console.log("Bắt đầu seed dữ liệu giày vào database");

  try {
    // Xóa tất cả sản phẩm cũ trước khi seed (để tránh trùng lặp)
    const countBefore = await prisma.product.count();
    if (countBefore > 0) {
      console.log(`Đang xóa ${countBefore} sản phẩm cũ`);
      await prisma.product.deleteMany({});
      // Reset AUTO_INCREMENT về 1
      await prisma.$executeRaw`ALTER TABLE products AUTO_INCREMENT = 1`;
      console.log("Đã xóa dữ liệu cũ và reset ID về 1");
    } else {
        console.log("Database trống, bắt đầu tạo sản phẩm mới");
    }

    // Tạo các sản phẩm mới
    for (const shoe of shoesData) {
      const product = await prisma.product.create({
        data: shoe,
      });
      console.log(`Đã tạo sản phẩm: ${product.name} (ID: ${product.id})`);
    }

    console.log(`Hoàn thành! Đã tạo ${shoesData.length} sản phẩm giày vào database`);
  } catch (error) {
    console.error("Lỗi khi seed dữ liệu:", error);
    throw error;
    }
  }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

