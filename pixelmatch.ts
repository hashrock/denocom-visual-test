import pixelmatch from "npm:pixelmatch";
import {
  decode,
  encode,
} from "https://deno.land/x/imagescript@1.2.15/utils/png.js";
import {
  pageList,
} from "./pagelist.ts";

class PNG {
  width: number;
  height: number;
  data: Uint8Array;
  constructor(width: number, height: number, data: Uint8Array) {
    this.width = width;
    this.height = height;
    this.data = data;
  }
}



async function compare(file: string, adir: string, bdir: string) {
  const a = `./screenshots/${adir}/${file}`;
  const b = `./screenshots/${bdir}/${file}`;
  const df = `./screenshots/diff/${file}`;

  const img1 = await decode(await Deno.readFile(a));
  const img2 = await decode(await Deno.readFile(b));
  const { width, height } = img1;
  const diff = new PNG(width, height, new Uint8Array(width * height * 4));
  pixelmatch(img1.pixels, img2.pixels, diff.data, width, height, {
    threshold: 0.1,
  });

  await Deno.mkdir("./screenshots/diff/", { recursive: true });

  await Deno.writeFile(
    df,
    await encode(diff.data, {
      width,
      height,
      channels: 4,
    }),
  );
}

if (Deno.args.length < 2) {
  console.log(
    "Usage: deno run --allow-read --allow-write pixelmatch.ts <dirA> <dirB>",
  );
}
const orig = Deno.args[0];
const local = Deno.args[1];

for (const url of pageList) {
  const basefilename = encodeURIComponent(orig);
  const localfilename = encodeURIComponent(local);

  const filename = encodeURIComponent(url);
  await compare(
    `${filename}.png`,
    basefilename,
    localfilename,
  );
}
