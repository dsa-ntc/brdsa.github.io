import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

const dev = 'http://localhost:5173';
const preview = 'http://localhost:4173';
const staging = 'https://brdsa.teauxfu.dev'
const prod = 'https://brdsa.org'
const domains = [
  // dev,
  //preview,
  staging,
  prod
];

const metasummary = './reports/metasummary.json';

function getUrls(domain) {
  return {
    'Homepage': `${domain}/`,
    'About': `${domain}/about`,
    'FITE': `${domain}/fite`,
    'Get Involved': `${domain}/get-involved`,
    'Our Work': `${domain}/about/campaigns`,
    'Donate': `${domain}/donate`,
  }
}

async function runLighthouse(domain, url, name) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: ['html'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);

  if(!runnerResult)
    return;

  // Save HTML report
  const reportHtml = runnerResult.report;
  const filename = `./reports/${sanitizeUrl(domain)}-${name.toLowerCase().replace(/\s+/g, '-')}.html`;
  fs.writeFileSync(filename, reportHtml.toString());
  console.log(`${name} report saved to ${filename}`);

  const summary = JSON.parse(fs.readFileSync(metasummary));
  const reportObj = {
    page: url.replace(domain, ''),
    build: domain === prod ?  'Jekyll' : 'SvelteKit',
    performance: (runnerResult.lhr.categories.performance.score ?? 0) * 100,
    accessibility: (runnerResult.lhr.categories.accessibility.score ?? 0 )* 100,
    bestPractices: (runnerResult.lhr.categories['best-practices'].score ?? 0 )* 100,
    seo: (runnerResult.lhr.categories.seo.score ?? 0) * 100,
  };
  summary.data.push(reportObj);
  fs.writeFileSync(metasummary, JSON.stringify(summary, null, 2));

  chrome.kill();
}

function sanitizeUrl(url) {
  return url
    .replace(/^https?:\/\//, '')  // Remove http:// or https://
    .replace(/:/g, '.');          // Replace all colons with dots
}


// MAIN 

(async () => {
  fs.writeFile(metasummary, JSON.stringify({ data: []}, null, 2), (e) => console.log(e));
  for (const domain of domains) {
    for (const [name, url] of Object.entries(getUrls(domain))) {
      try {
        console.log(`\nTesting ${name}: ${url}`);
        await runLighthouse(domain, url, name);
      } catch (err) {
        console.error(`Error testing ${url}:`, err);
      }
    }
  }
})();