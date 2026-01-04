import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";
import { parseFeature } from "./parser/validation-pipeline.ts";
import { readContentFromFile } from "./utils/load-content-file.ts";
import { ensureDir } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";
import { FieldIR } from "./parser/specs-validators.ts";

// Java Imports
import { createSpringFeatureIR } from "./transformers/pipeline.ts";
import { generateEntity as generateJavaEntity } from "./generators/entity.generator.ts";
import { generateRepository as generateJavaRepository } from "./generators/repository.generator.ts";
import { generateDto as generateJavaDto } from "./generators/dto.generator.ts";
import { generateMapper as generateJavaMapper } from "./generators/mapper.generator.ts";
import { generateService as generateJavaService } from "./generators/service.generator.ts";
import { generateController as generateJavaController } from "./generators/controller.generator.ts";

// Kotlin Imports
import { createSpringKotlinFeatureIR } from "./transformers/kotlin/pipeline.ts";
import { generateKotlinEntity } from "./generators/kotlin/entity.generator.ts";
import { generateKotlinRepository } from "./generators/kotlin/repository.generator.ts";
import { generateKotlinDto } from "./generators/kotlin/dto.generator.ts";
import { generateKotlinMapper } from "./generators/kotlin/mapper.generator.ts";
import { generateKotlinService } from "./generators/kotlin/service.generator.ts";
import { generateKotlinController } from "./generators/kotlin/controller.generator.ts";
import { generateKotlinEnum } from "./generators/kotlin/enum.generator.ts";


const args = parse(Deno.args, {
    string: ["lang"],
    default: { lang: "java" },
});

const specPath = args._[0] as string || "example.json";
const dtoSpecPath = args._[1] as string || "dtos.json";
const basePackage = args._[2] as string || "com.example.generated";
const lang = args.lang.toLowerCase();

if (lang !== "java" && lang !== "kotlin") {
    console.error(`Unsupported language: ${lang}. Please choose 'java' or 'kotlin'.`);
    Deno.exit(1);
}

const outputBaseDir = `./generated/src/main/${lang}`;

async function writeCodeFile(
  packageName: string,
  className: string,
  code: string,
  extension: string
) {
  const packagePath = packageName.replace(/\./g, "/");
  const outputDir = `${outputBaseDir}/${packagePath}`;
  await ensureDir(outputDir);
  const filePath = `${outputDir}/${className}.${extension}`;
  await Deno.writeTextFile(filePath, code);
  console.log(`Generated: ${filePath}`);
}


try {
  console.log(`Loading feature spec: ${specPath}`);
  const featureContent = await readContentFromFile(specPath);
  const featureSpec = JSON.parse(featureContent);

  console.log(`Loading DTO spec: ${dtoSpecPath}`);
  const dtosContent = await readContentFromFile(dtoSpecPath);
  const dtosSpec = JSON.parse(dtosContent);

  console.log("Parsing and validating specifications...");
  const { feature, dtos } = parseFeature(featureSpec, dtosSpec);
  
  if (lang === "java") {
    console.log("Transformation specs to Java Spring IR ...");
    const ir = createSpringFeatureIR(feature, dtos, basePackage);

    console.log("\nGenerating Java files...");
    await writeCodeFile(ir.entity.packageName, ir.entity.className, generateJavaEntity(ir.entity), "java");
    await writeCodeFile(ir.repository.packageName, ir.repository.className, generateJavaRepository(ir.repository), "java");
    for (const dto of ir.dtos) {
      await writeCodeFile(dto.packageName, dto.className, generateJavaDto(dto), "java");
    }
    await writeCodeFile(ir.mapper.packageName, ir.mapper.className, generateJavaMapper(ir.mapper), "java");
    await writeCodeFile(ir.service.packageName, ir.service.className, generateJavaService(ir.service), "java");
    await writeCodeFile(ir.controller.packageName, ir.controller.className, generateJavaController(ir.controller), "java");
    console.log("\nJava code generation complete!");

  } else if (lang === "kotlin") {
    console.log("Transformation specs to Kotlin Spring IR ...");
    const ir = createSpringKotlinFeatureIR(feature, dtos, basePackage);

    console.log("\nGenerating Kotlin files...");

    // Generate Enums
    for (const field of feature.fields) {
        const enumInfo = generateKotlinEnum(field as FieldIR, basePackage);
        if (enumInfo) {
            await writeCodeFile(enumInfo.packageName, enumInfo.className, enumInfo.code, "kt");
        }
    }

    await writeCodeFile(ir.entity.packageName, ir.entity.className, generateKotlinEntity(ir.entity), "kt");
    await writeCodeFile(ir.repository.packageName, ir.repository.className, generateKotlinRepository(ir.repository), "kt");
    for (const dto of ir.dtos) {
      await writeCodeFile(dto.packageName, dto.className, generateKotlinDto(dto), "kt");
    }
    await writeCodeFile(ir.mapper.packageName, ir.mapper.className, generateKotlinMapper(ir.mapper), "kt");
    await writeCodeFile(ir.service.packageName, ir.service.className, generateKotlinService(ir.service), "kt");
    await writeCodeFile(ir.controller.packageName, ir.controller.className, generateKotlinController(ir.controller), "kt");
    console.log("\nKotlin code generation complete!");
  }

} catch (err: unknown) {
  console.error("An error occurred:");
  // @ts-ignore
  console.error(err?.message ?? "Unknown error");
  if (err instanceof Error) {
    console.error(err.stack);
  }
  Deno.exit(1);
}
