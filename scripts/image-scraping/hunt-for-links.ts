import * as cheerio from "cheerio";
import axios from "axios";
import * as fs from "node:fs";
import path from "node:path";

const startUrl =
  "https://archives.bulbagarden.net/wiki/Category:Ken_Sugimori_Pok%C3%A9mon_artwork";

async function grab() {
  const links: string[] = [];

  let count = 0;
  async function grabLinks(url: string) {
    count++;
    // if (count > 3) {
    //   return;
    // }

    console.log(`Grabbing ${count}...`);

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const newLinks = $("a[href^='/wiki/']")
      .map((i, el) => $(el).attr("href"))
      .get()
      .map((path) => new URL(path, url).toString());

    links.push(...newLinks);

    const nextLink = $("a:contains('next page')").attr("href");
    if (!nextLink) {
      return;
    }

    await grabLinks(new URL(nextLink, url).toString());
  }

  await grabLinks(startUrl);

  // Could filter this, idk
  const relevantLinks = [...new Set(links)];

  fs.writeFileSync(
    path.resolve(process.cwd(), "scripts/image-scraping/links.txt"),
    relevantLinks.join("\n"),
  );
}

grab();
