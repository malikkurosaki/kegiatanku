import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

interface GenerateEnvTypesOptions {
    envFilePath?: string;
    outputDir?: string;
    outputFileName?: string;
}

export function generateEnvTypes(options: GenerateEnvTypesOptions = {}) {
    const {
        envFilePath = path.resolve(process.cwd(), ".env"),
        outputDir = path.resolve(process.cwd(), "types"),
        outputFileName = "env.d.ts",
    } = options;

    const outputFile = path.join(outputDir, outputFileName);

    // 1. Baca .env
    if (!fs.existsSync(envFilePath)) {
        console.warn(`⚠️ .env file not found at: ${envFilePath}`);
        return;
    }

    const envContent = fs.readFileSync(envFilePath, "utf-8");
    const parsed = dotenv.parse(envContent);

    // 2. Generate TypeScript declare
    const lines = Object.keys(parsed).map((key) => `    ${key}?: string;`);

    const fileContent = `declare namespace NodeJS {
  interface ProcessEnv {
${lines.join("\n")}
  }
}
`;

    // 3. Buat folder kalau belum ada
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 4. Tulis file
    fs.writeFileSync(outputFile, fileContent, "utf-8");

    console.log(`✅ Env types generated at: ${outputFile}`);
}

if (import.meta.main) {
    generateEnvTypes();
}

