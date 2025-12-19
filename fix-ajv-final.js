const fs = require("fs");
const path = require("path");

console.log("🔧 Исправление ajv-draft-04...");

const targetFile = path.join(__dirname, "node_modules", "ajv-draft-04", "dist", "index.js");
const ajvCoreFile = path.join(__dirname, "node_modules", "ajv", "dist", "core.js");

// Проверяем файлы
if (!fs.existsSync(targetFile)) {
  console.error(" Целевой файл не найден:", targetFile);
  process.exit(1);
}

if (!fs.existsSync(ajvCoreFile)) {
  console.error(" Файл ajv/dist/core.js не найден:", ajvCoreFile);
  process.exit(1);
}

console.log(" Файл ajv/dist/core.js существует");

// Читаем исходный файл
let content = fs.readFileSync(targetFile, "utf8");
const originalContent = content;

// Исправляем ВСЕ обращения к ajv/dist
console.log(" Заменяю пути в файле...");

// Вариант 1: Заменяем на относительный путь к правильному ajv
content = content.replace(
  /require\("ajv\/dist\/core"\)/g,
  'require("./../../../ajv/dist/core")'
);

// Вариант 2: Заменяем другие обращения к ajv/dist
content = content.replace(
  /require\("ajv\/dist\/vocabularies\/discriminator"\)/g,
  'require("./../../../ajv/dist/vocabularies/discriminator")'
);

// Проверяем изменения
if (content === originalContent) {
  console.log(" Содержимое не изменилось. Пробуем другой подход...");
  
  // Альтернативный подход: заменяем на прямой require к модулю
  content = content.replace(
    /const core_1 = require\("ajv\/dist\/core"\);/g,
    `const ajvCore = require("${ajvCoreFile.replace(/\\/g, "\\\\")}");
const core_1 = ajvCore;`
  );
}

// Записываем исправленный файл
fs.writeFileSync(targetFile, content, "utf8");
console.log(" Файл исправлен!");

// Тест: пробуем загрузить исправленный модуль
try {
  console.log(" Тестируем загрузку модуля...");
  delete require.cache[require.resolve(targetFile)];
  const testModule = require(targetFile);
  console.log(" Модуль загружен успешно!");
} catch (error) {
  console.error(" Ошибка при загрузке модуля:", error.message);
  
  // Показываем, какие модули ajv есть в системе
  console.log("\n Поиск всех модулей ajv в node_modules:");
  const findModules = (dir) => {
    const results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (item === "ajv" || item.startsWith("ajv-")) {
          const pkgPath = path.join(fullPath, "package.json");
          if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
            results.push(`${item}@${pkg.version} (${fullPath})`);
          }
        }
        results.push(...findModules(fullPath));
      }
    }
    return results;
  };
  
  const allAjv = findModules(path.join(__dirname, "node_modules"));
  console.log("Найдены модули ajv:");
  allAjv.forEach(m => console.log(" -", m));
}
