import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { join } from "https://deno.land/std@0.190.0/path/mod.ts";

const { args } = Deno;
if (args.length < 1) {
  console.log("Usage: deno run --allow-read --allow-write screenshot.ts <baseurl> <dir_name>");
  console.log("Example: deno run --allow-read --allow-write screenshot.ts http://localhost:8000 new");
  Deno.exit(1);
}
const base = args[0];
const screenshotDir = "./screenshots/" + args[1];

const browser = await puppeteer.launch({
  args: ["--no-sandbox"],
  defaultViewport: { width: 1600, height: 4000 },
});
const page = await browser.newPage();

export const pageList = [
  "",
  "runtime",
  "std@0.192.0",
  "x",
  "manual@v1.34.3/introduction",
  "manual@v1.34.3/basics/standard_library",
  "deploy",
  "deploy/docs",
  "deploy/pricing",
  "deploy/docs/privacy-policy",
  "api@v1.34.3?s=BroadcastChannel",
  "api@v1.34.3?s=Headers",
  "benchmarks",
  "saaskit",
  "blog",
  "blog/announcing-soc2-compliance",
];

async function getScreenshots(base: string, dist: string) {
  for (const url of pageList) {
    const absolute = join(base, url);
    await page.goto(absolute);
    const filename = encodeURIComponent(url);
    await Deno.mkdir(  dist, { recursive: true });
    await page.screenshot({
      path: `${dist}/${filename}.png`,
    });
    console.log("Saved screenshot for " + absolute);
  }
}

await getScreenshots(base, screenshotDir);

await browser.close();
