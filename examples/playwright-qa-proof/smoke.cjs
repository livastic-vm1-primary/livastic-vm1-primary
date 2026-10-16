"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright-core");

// Reproducible, non-destructive sample on VM1-owned PUBLIC pages only.
// It never signs in, submits a contact form, makes a purchase or scans a third party.
const OUTPUT = path.join(__dirname,"evidence");
const BASE = "https://livastic-vm1-primary.github.io/paperpilot-tools/";
const HOST = "livastic-vm1-primary.github.io";
const flows = [];
const errors = [];
const otherRequests = [];
const started = new Date().toISOString();

async function newPage(browser,width,height) {
 const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on("pageerror",e=>errors.push(String(e.message).slice(0,200)));
 page.on("request",req=>{
   try {
     const host=new URL(req.url()).hostname;
     if(host!==HOST)otherRequests.push(host);
     if(!["GET","HEAD"].includes(req.method()))otherRequests.push("non-readonly-request");
   }catch{}
 });
 return page;
}

async function overflowCheck(page) {
 const n=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 assert.ok(n<=2,"Horizontal overflow: "+n+"px");
 return n;
}

async function main() {
 await fs.mkdir(OUTPUT,{recursive:true});
 const browser=await chromium.launch({
   executablePath:process.env.CHROME_EXECUTABLE||"/usr/bin/google-chrome",
   headless:true,
   args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]
 });
 const chromeVersion=browser.version();
 try {
  // F1: English/Korean free quote calculator, truthful sample arithmetic.
  {
   const page=await newPage(browser,1440,900);
   const res=await page.goto(BASE,{waitUntil:"networkidle",timeout:26000});
   assert.equal(res.status(),200);
   assert.equal(await page.locator("#total").innerText(),"$445.50");
   await page.locator("#rate").fill("200");
   await page.locator("#qty").fill("4");
   await page.locator("#discount").fill("20");
   await page.locator("#tax").fill("10");
   assert.equal(await page.locator("#subtotal").innerText(),"$800.00");
   assert.equal(await page.locator("#discount-value").innerText(),"−$160.00");
   assert.equal(await page.locator("#tax-value").innerText(),"$64.00");
   assert.equal(await page.locator("#total").innerText(),"$704.00");
   await page.locator("#lang").click();
   assert.equal(await page.locator("html").getAttribute("lang"),"ko");
   assert.match(await page.locator("#demo").innerText(),/간편 견적/);
   const overflow=await overflowCheck(page);
   await page.screenshot({path:path.join(OUTPUT,"01-usd-quote-desktop.png"),fullPage:true});
   flows.push({id:"F1",name:"USD sample quote and Korean UI",status:"PASS",width:1440,http:res.status(),overflow,evidence:"evidence/01-usd-quote-desktop.png",observed:"Line item 200 USD × 4 => 800 USD, less 20% => 640 USD, plus 10% on discounted subtotal => 704 USD. Korean UI toggle works."});
   await page.close();
  }
  // F2: Korean KRW and HTML-safe client input on mobile.
  {
   const page=await newPage(browser,390,844);
   const res=await page.goto(BASE+"freelance-estimate-ko.html",{waitUntil:"networkidle",timeout:26000});
   assert.equal(res.status(),200);
   assert.equal(await page.locator("#grand-total").innerText(),"700,000원");
   await page.locator("#discount").fill("5");
   await page.locator("#tax").fill("10");
   assert.equal(await page.locator("#discount-amount").innerText(),"−35,000원");
   assert.equal(await page.locator("#tax-amount").innerText(),"66,500원");
   assert.equal(await page.locator("#grand-total").innerText(),"731,500원");
   await page.locator("#item").fill("<img src=x onerror=alert(1)>");
   assert.equal(await page.locator(".quote-results img").count(),0);
   assert.match(await page.locator("#preview-name").innerText(),/onerror=alert/);
   await page.locator("#sample").click();
   const overflow=await overflowCheck(page);
   await page.screenshot({path:path.join(OUTPUT,"02-krw-mobile.png"),fullPage:true});
   flows.push({id:"F2",name:"KRW example, mobile layout and safe text",status:"PASS",width:390,http:res.status(),overflow,evidence:"evidence/02-krw-mobile.png",observed:"700,000 KRW minus 35,000 KRW discount plus illustrative 66,500 KRW tax => 731,500 KRW. HTML-like user text stays text, never becomes DOM markup."});
   await page.close();
  }
  // F3: CTA and required third-party consent; do not submit a real form.
  {
   const page=await newPage(browser,390,844);
   const res=await page.goto(BASE+"services.html",{waitUntil:"networkidle",timeout:26000});
   assert.equal(res.status(),200);
   assert.equal(await page.locator(".service-card").count(),3);
   const cta=page.locator('a.btn[href="contact.html"]');
   assert.ok(await cta.count()>=2);
   await cta.first().click();
   await page.waitForURL("**/contact.html");
   const form=page.locator("form#project-inquiry-form");
   assert.equal(await form.count(),1);
   assert.equal(await form.evaluate(el=>el.checkValidity()),false);
   const consent=page.locator('input[name="third_party_form_consent"]');
   assert.equal(await consent.isChecked(),false);
   assert.equal(await consent.getAttribute("required")!==null,true);
   assert.match(await page.locator(".contact-consent").innerText(),/제3자 FormSubmit/);
   assert.equal(await page.locator('input[type="password"]').count(),0);
   assert.equal(await page.locator('input[type="file"]').count(),0);
   const overflow=await overflowCheck(page);
   await page.screenshot({path:path.join(OUTPUT,"03-consent-inquiry-mobile.png"),fullPage:true});
   flows.push({id:"F3",name:"Service to inquiry CTA and consent",status:"PASS",width:390,http:res.status(),overflow,evidence:"evidence/03-consent-inquiry-mobile.png",observed:"Three service cards. Visible contact CTA reaches required empty form and mandatory third-party relay consent. No password/upload fields. Form NOT submitted."});
   await page.close();
  }
  assert.equal(flows.length,3);
  assert.deepEqual(errors,[]);
  assert.deepEqual(otherRequests,[]);
  const report={
   observedUTC:started,
   sample:true,
   siteHost:HOST,
   provenance:"Owned publicly available demo only. No client, paid engagement, order, or customer data.",
   testedUsing:"Playwright-core 1.58.2 and Google Chrome "+chromeVersion,
   pass:flows.length===3&&errors.length===0&&otherRequests.length===0,
   flowDetails:flows,uncaughtJsErrors:errors,foreignNetworkRequests:otherRequests,
   limitations:["Not a security audit or regulatory compliance assessment.","No private/authenticated/customer systems exercised.","Contact form NOT submitted; email delivery not retested.","The money calculations are hypothetical, not tax advice.","No paid customer, settlement, deposit, or revenue is claimed."]
  };
  await fs.writeFile(path.join(__dirname,"qa-report.json"),JSON.stringify(report,null,2)+"\n");
  const markdown=[
   "# Playwright QA example: Three owned public website flows","",
   "**Synthetic sample, not client work or a completed paid order.**","",
   "Observed (UTC): "+started,
   "Chrome: "+chromeVersion,
   "Library: playwright-core 1.58.2","",
   "| Flow | Viewport | HTTP | Evidence |",
   "|---|---:|---:|---|",
   ...flows.map(f=>"| "+f.id+" "+f.name+" | "+f.width+"px | "+f.http+" | ["+f.evidence+"]("+f.evidence+") |"),"",
   "## Observations","",
   ...flows.map(f=>"- **"+f.id+"**: "+f.observed),"",
   "No uncaught JavaScript errors and no network request outside "+HOST+" during these runs.","",
   "## Limits","",
   ...report.limitations.map(t=>"- "+t),"",
   "## Re-run with Google Chrome installed","",
   "~~~bash","npm ci --include=dev","CHROME_EXECUTABLE=/usr/bin/google-chrome npm test","~~~","",
   "Tests use only publicly accessible pages, never customer credentials or production mutations.",""
  ];
  await fs.writeFile(path.join(__dirname,"qa-report.md"),markdown.join("\n"));
  console.log("QA_PROOF_PASS",JSON.stringify({flows:flows.length,chrome:chromeVersion,errors:errors.length,foreignNetworkRequests:otherRequests.length,evidence:flows.map(f=>f.evidence)}));
 }finally{
  await browser.close();
 }
}
main().catch(e=>{console.error("QA_PROOF_FAILED",String(e.stack||e).slice(0,1400));process.exitCode=1;});
