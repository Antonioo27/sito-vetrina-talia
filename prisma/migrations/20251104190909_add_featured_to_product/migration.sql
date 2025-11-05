-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "discount" REAL,
    "imageUrl" TEXT,
    "typology" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "weight" REAL,
    "height" REAL,
    "width" REAL,
    "length" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "description", "discount", "height", "id", "imageUrl", "length", "name", "price", "typology", "updatedAt", "weight", "width") SELECT "createdAt", "description", "discount", "height", "id", "imageUrl", "length", "name", "price", "typology", "updatedAt", "weight", "width" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
