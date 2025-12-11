#!/usr/bin/env bun
import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

import { readdirSync, statSync, writeFileSync } from "fs";
import _ from "lodash";
import { basename, extname, join, relative } from "path";

const PAGES_DIR = join(process.cwd(), "src/pages");
const OUTPUT_FILE = join(process.cwd(), "src/AppRoutes.tsx");

/******************************
 * Prefetch Helper Template
 ******************************/
const PREFETCH_HELPER = `
/**
 * Prefetch lazy component:
 * - Hover
 * - Visible (viewport)
 * - Browser idle
 */
export function attachPrefetch(el: HTMLElement | null, preload: () => void) {
  if (!el) return;
  let done = false;

  const run = () => {
    if (done) return;
    done = true;
    preload();
  };

  // 1) On hover
  el.addEventListener("pointerenter", run, { once: true });

  // 2) On visible (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    if (entries && entries[0] && entries[0].isIntersecting) {
      run();
      io.disconnect();
    }
  });
  io.observe(el);

  // 3) On idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => run());
  } else {
    setTimeout(run, 200);
  }
}
`;

/******************************
 * Component Name Generator
 ******************************/
const toComponentName = (fileName: string): string =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "");

/******************************
 * Route Path Normalizer
 ******************************/
function toRoutePath(name: string): string {
  name = name.replace(/\.[^/.]+$/, "");

  if (name.toLowerCase() === "home") return "/";
  if (name.toLowerCase() === "login") return "/login";
  if (name.toLowerCase() === "notfound") return "/*";

  if (name.startsWith("[") && name.endsWith("]"))
    return `:${name.slice(1, -1)}`;

  name = name.replace(/_page$/i, "").replace(/^form_/i, "");
  return _.kebabCase(name);
}

/******************************
 * Scan Folder + Validation + Dynamic Duplicate Check
 ******************************/
function scan(dir: string): any[] {
  const items = readdirSync(dir);
  const routes: any[] = [];
  const dynamicParams = new Set<string>();

  for (const item of items) {
    const full = join(dir, item);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      if (!/^[a-zA-Z0-9_-]+$/.test(item)) {
        console.warn(`⚠️ Invalid folder name: ${item}`);
      }

      routes.push({
        name: item,
        path: _.kebabCase(item),
        children: scan(full),
      });
    } else if (extname(item) === ".tsx") {
      const base = basename(item, ".tsx");

      if (!/^[a-zA-Z0-9_[\]-]+$/.test(base)) {
        console.warn(`⚠️ Invalid file name: ${item}`);
      }

      if (base.startsWith("[") && base.endsWith("]")) {
        const p = base.slice(1, -1);
        if (dynamicParams.has(p)) {
          console.error(`❌ Duplicate dynamic param "${p}" in ${dir}`);
          process.exit(1);
        }
        dynamicParams.add(p);
      }

      routes.push({
        name: base,
        filePath: relative(join(process.cwd(), "src"), full).replace(/\\/g, "/"),
      });
    }
  }
  return routes;
}

/******************************
 * Index Detection
 ******************************/
function findIndexFile(folderName: string, children: any[]) {
  const lower = folderName.toLowerCase();

  return (
    children.find((r: any) => r.name.toLowerCase().endsWith("_home")) ||
    children.find((r: any) => r.name.toLowerCase() === "index") ||
    children.find((r: any) => r.name.toLowerCase() === `${lower}_page`)
  );
}

/******************************
 * Generate JSX <Route> (Lazy + Prefetch)
 ******************************/
function generateJSX(routes: any[], parentPath = ""): string {
  let jsx = "";


  for (const route of routes) {
    if (route.children) {
      const layout = route.children.find((r: any) =>
        r.name.endsWith("_layout")
      );

      if (layout) {
        const LayoutComp = toComponentName(
          layout.name.replace("_layout", "Layout")
        );

        const nested = route.children.filter((x: any) => x !== layout);
        const nestedRoutes = generateJSX(nested, `${parentPath}/${route.path}`);

        const indexFile = findIndexFile(route.name, route.children);

        const indexRoute = indexFile
          ? `<Route index element={<${toComponentName(
              indexFile.name
            )}.Component />} />`
          : `<Route index element={<Navigate to="${(
              parentPath +
              "/" +
              route.path +
              "/" +
              (nested[0]?.name ?? "")
            ).replace(/\/+/g, "/")}" replace />}/>`;

        jsx += `
        <Route path="${parentPath}/${route.path}" element={<${LayoutComp}.Component />}>
          ${indexRoute}
          ${nestedRoutes}
        </Route>
        `;
      } else {
        jsx += generateJSX(route.children, `${parentPath}/${route.path}`);
      }
    } else {
      const Comp = toComponentName(route.name);
      const routePath = toRoutePath(route.name);

      const fullPath = routePath.startsWith("/")
        ? routePath
        : `${parentPath}/${routePath}`.replace(/\/+/g, "/");

      jsx += `
      <Route 
        path="${fullPath}"
        element={
          <React.Suspense fallback={<SkeletonLoading />}>
            <${Comp}.Component />
          </React.Suspense>
        }
      />
      `;
    }
  }

  return jsx;
}

/******************************
 * Lazy Import + Prefetch Injection
 ******************************/
function generateImports(routes: any[]): string {
  const list: string[] = [];

  function walk(rs: any[]) {
    for (const r of rs) {
      if (r.children) walk(r.children);
      else {
        const C = toComponentName(r.name);
        const file = r.filePath.replace(/\.tsx$/, "");

        list.push(`
          const ${C} = {
            Component: React.lazy(() => import("./${file}")),
            preload: () => import("./${file}")
          };
        `);
      }
    }
  }
  walk(routes);
  return list.join("\n");
}

/******************************
 * Generate AppRoutes.tsx
 ******************************/
function generateRoutes() {
  const allRoutes = scan(PAGES_DIR);
  const imports = generateImports(allRoutes);
  const jsx = generateJSX(allRoutes);

  let loadingSkeleton = `
  const SkeletonLoading = () => {
    return (
      <div style={{ padding: "20px" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} height={70} radius="md" animate={true} mb="sm" />
        ))}
      </div>
    );
  };
  
  `

  const final = `
// ⚡ AUTO-GENERATED — DO NOT EDIT
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Skeleton } from "@mantine/core";

${loadingSkeleton}
${PREFETCH_HELPER}
${imports}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        ${jsx}
      </Routes>
    </BrowserRouter>
  );
}
`;

  writeFileSync(OUTPUT_FILE, final);
  console.log(`✅ Routes generated → ${OUTPUT_FILE}`);

  Bun.spawnSync(["bunx", "prettier", "--write", "src/**/*.tsx"]);
}

/******************************
 * Extract flat client routes
 ******************************/
const SRC_DIR = path.resolve("src");
const APP_ROUTES_FILE = join(SRC_DIR, "AppRoutes.tsx");

interface RouteNode {
  path: string;
  children: RouteNode[];
}

function getAttributePath(attrs: any[]) {
  const attr = attrs.find(
    (a) => t.isJSXAttribute(a) && a.name.name === "path"
  ) as any;

  return attr?.value?.value ?? "";
}

function extractRouteNodes(node: t.JSXElement): RouteNode | null {
  const op = node.openingElement;
  if (!t.isJSXIdentifier(op.name) || op.name.name !== "Route") return null;

  const cur = getAttributePath(op.attributes);
  const children: RouteNode[] = [];

  for (const c of node.children) {
    if (t.isJSXElement(c)) {
      const n = extractRouteNodes(c);
      if (n) children.push(n);
    }
  }
  return { path: cur, children };
}

function flattenRoutes(node: RouteNode, parent = ""): Record<string, string> {
  const r: Record<string, string> = {};
  let full = node.path;

  if (full) {
    if (!full.startsWith("/"))
      full =
        parent && full !== "/"
          ? `${parent.replace(/\/$/, "")}/${full}`
          : "/" + full;
    full = full.replace(/\/+/g, "/");
    r[full] = full;
  }

  for (const c of node.children)
    Object.assign(r, flattenRoutes(c, full || parent));

  return r;
}

function extractRoutes(code: string) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const routes: Record<string, string> = {};

  traverse(ast, {
    JSXElement(p) {
      const op = p.node.openingElement;

      if (t.isJSXIdentifier(op.name) && op.name.name === "Routes") {
        for (const c of p.node.children) {
          if (t.isJSXElement(c)) {
            const root = extractRouteNodes(c);
            if (root) Object.assign(routes, flattenRoutes(root));
          }
        }
      }
    },
  });

  return routes;
}

/******************************
 * Type-Safe Route Builder
 ******************************/
function generateTypeSafe(routes: Record<string, string>) {
  const keys = Object.keys(routes).filter((x) => !x.includes("*"));
  const union = keys.map((x) => `"${x}"`).join(" | ");

  const code = `
export type AppRoute = ${union};

export function route(path: AppRoute, params?: Record<string,string|number>) {
  if (!params) return path;
  let final = path;
  for (const k of Object.keys(params)) {
    final = final.replace(":" + k, params[k] + "") as AppRoute;
  }
  return final;
}
`;

  fs.writeFileSync(join(SRC_DIR, "routeTypes.ts"), code);
  console.log("📄 routeTypes.ts generated.");
}

/******************************
 * MAIN
 ******************************/
export default function run() {
  generateRoutes();

  const code = fs.readFileSync(APP_ROUTES_FILE, "utf-8");
  const routes = extractRoutes(code);

  const out = join(SRC_DIR, "clientRoutes.ts");

  fs.writeFileSync(
    out,
    `// AUTO-GENERATED\nconst clientRoutes = ${JSON.stringify(
      routes,
      null,
      2
    )} as const;\nexport default clientRoutes;`
  );

  console.log(`📄 clientRoutes.ts saved → ${out}`);

  generateTypeSafe(routes);
}

run();
