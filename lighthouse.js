const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

(async () => {
   const reportDir = "./reports";

   if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
   }

   const currentDateTime = new Date().toISOString();
   const pageLinks = [
      {
         name: "Page 1",
         link: "https://orsted.com/",
      },
      {
         name: "Page 2",
         link: "https://orsted.com/en/careers/vacancies-list",
      },
      {
         name: "Page 3",
         link: "https://orsted.com/en/investors/ir-material/financial-reports-and-presentations",
      },
   ];
   const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
   const options = {
      logLevel: "info",
      output: "html",
      onlyCategories: ["accessibility"],
      port: chrome.port,
   };
   for (let i = 0; i < pageLinks.length; i++) {
      let runnerResult = await lighthouse(pageLinks[i]["link"], options);
      let reportHtml = runnerResult.report;
      fs.writeFileSync(`reports/page-${i}.html`, reportHtml);
   }
   // `.report` is the HTML report as a string

   // `.lhr` is the Lighthouse Result as a JS object
   // console.log("Report is done for", runnerResult.lhr.finalUrl);
   // console.log(
   //    "Accessibility score was",
   //    runnerResult.lhr.categories.accessibility.score * 100
   // );

   await chrome.kill();
})();
