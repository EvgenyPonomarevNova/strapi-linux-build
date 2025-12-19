const fs = require("fs");
const path = require("path");

console.log(" Создаю правильный require...");

const targetFile = path.join(__dirname, "node_modules", "ajv-draft-04", "dist", "index.js");
const correctAjvPath = path.join(__dirname, "node_modules", "ajv");

if (!fs.existsSync(targetFile)) {
  console.error(" Файл не найден:", targetFile);
  process.exit(1);
}

console.log(" Найден файл:", targetFile);
console.log(" Правильный путь к ajv:", correctAjvPath);

// Читаем файл
let content = fs.readFileSync(targetFile, "utf8");

// Заменяем require на абсолютный путь
content = content.replace(
  /const core_1 = require\("ajv\/dist\/core"\);/g,
  `const core_1 = require("${correctAjvPath.replace(/\\/g, "/")}/dist/core");`
);

content = content.replace(
  /const discriminator_1 = require\("ajv\/dist\/vocabularies\/discriminator"\);/g,
  `const discriminator_1 = require("${correctAjvPath.replace(/\\/g, "/")}/dist/vocabularies/discriminator");`
);

// Заменяем другие require
content = content.replace(
  /var core_2 = require\("ajv\/dist\/core"\);/g,
  `var core_2 = require("${correctAjvPath.replace(/\\/g, "/")}/dist/core");`
);

content = content.replace(
  /var core_3 = require\("ajv\/dist\/core"\);/g,
  `var core_3 = require("${correctAjvPath.replace(/\\/g, "/")}/dist/core");`
);

// Записываем обратно
fs.writeFileSync(targetFile, content, "utf8");
console.log(" Файл исправлен!");

// Тестируем
try {
  console.log(" Тестирую require...");
  delete require.cache[require.resolve(correctAjvPath + "/dist/core")];
  const coreModule = require(correctAjvPath + "/dist/core");
  console.log(" Модуль ajv/dist/core загружен!");
  
  // Тестируем исправленный файл
  delete require.cache[require.resolve(targetFile)];
  const draft04Module = require(targetFile);
  console.log(" Модуль ajv-draft-04 загружен!");
} catch (error) {
  console.error(" Ошибка:", error.message);
  console.error("Stack:", error.stack);
}
