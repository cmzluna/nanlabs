const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const puppeteer = require("puppeteer");

const expandTilde = require("expand-tilde");
// URL
// function resolveHome(filepath) {
//   let a;

//   if (newPath[0] === "~") {
//     newPath = expandTilde(newPath);
//   }
//   console.log(newPath);
//   return newPath;
//   //  return newPath;
// }

function resolveHome(filepath) {
  let newPath = filepath.replace(/\s+/g, "").trim();
  if (newPath[0] === "~") {
    return path.join(process.env.HOME, newPath.slice(1));
  }
  return newPath;
}

async function getData(name, url, fs) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let getSize = function (url) {
      return axios
        .head(url)
        .then((response) => console.log(response.headers["content-length"]))
        .catch((err) => {
          // Handle Error Here
        });
    };

    await page.goto(url);
    await page.exposeFunction("getSize", getSize);

    let data = await page.evaluate((name) => {
      let results = [];
      let obj = {};
      let items = document.querySelectorAll("script[src]");
      let sizeSum = 0;
      items.forEach((item) => {
        let info = item.getAttribute("src");
        let size = getSize(info);
        sizeSum += size;
        //  let size = getFilesizeInBytes(info);
        obj[name] = info;
        results.push({
          name: name,
          item: info,
          size: size,
        });
      });

      let res = results.map((el) => el.name + ", " + el.item + ", " + sizeSum);
      return res;
    }, name);

    // console.log(name);
    console.log(data);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

const file = "websites.csv";

// Check if the file exists in the current directory, and if it is readable.
fs.access(file, fs.constants.F_OK | fs.constants.R_OK, (err) => {
  if (err) {
    console.error(
      `${file} ${err.code === "ENOENT" ? "does not exist" : "is read-only"}`
    );
  } else {
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      output: process.stdout,
      terminal: false,
    });

    rl.on("line", (line) => {
      // accede a cada archivo o URL
      let name = line.split(",")[0];
      let url = line.split(",")[1];
      // console.log(name);
      getData(name, url);
    });
  }
});

/*
let resource = "trello/index.html";
axios
  .get(resource)
  .then((response) => {
    // `response` is an HTTP response object, whose body is contained in it's `data` attribute

    // This will print the HTML source code to the console
    console.log(response.data);
  })
  .catch((err) => console.log(`Resource ${resource} couldn't be accessed.`));

// resolver el path en archivos locales

console.log(process.env.HOME);
resolveHome("~/trello/index.html");





*/
/*
const file = fs.createWriteStream("file.jpg");
const request = http.get(
  "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg",
  function (response) {
    response.pipe(file);
  }
);

async function getForum() {
  try {
    const response = await axios.get(
      "https://www.reddit.com/r/programming.json"
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const htmlString = "<label>Username: John Doe</label>";
const result = htmlString.match(/<label>(.+)<\/label>/);

console.log(result[1], result[1].split(": ")[1]);
// Username: John Doe, John Doe

//  If you're using axios, you can fetch the head like:
const checkUrl = async (url) => {
  try {
    await axios.head(fullUrl);
    return true;
  } catch (error) {
    if (error.response.status >= 400) {
      return false;
    }
  }
};


const fs = require('fs')

const dir = '/Users/flavio/folder'
const files = fs.readdirSync(dir)

for (const file of files) {
  console.log(file)
}




var scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
  if (scripts[i].src) {
  	console.log(i, scripts[i].src);
  } else { 
    console.log(i, scripts[i].innerHTML);
  }
}

*/
