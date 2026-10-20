import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const doc=read('README.md');
const issue=read('.github/ISSUE_TEMPLATE/project-inquiry.yml');

test('original profile links actual existing free Koinly, crypto CSV and Base USDC software',()=>{
  for(const slug of ['koinly-column-mapper.html','crypto-csv-rescue.html','usdc-invoice-reconcile.html']){
    assert.ok(doc.includes('https://livastic-vm1-primary.github.io/paperpilot-tools/'+slug),slug);
  }
  assert.ok(doc.includes('same-owner'));
  assert.ok(doc.includes('VM1/VM2/VM3/VM5'));
  assert.ok(doc.includes('not affiliated with Koinly, Circle'));
});
test('first opt-in customer email is a draft for the genuine one-owner mailbox, never a payment',()=>{
  const start=doc.indexOf('## Can I help with');
  const end=doc.indexOf('## Working tools',start);
  assert.ok(start>=0&&end>start);
  const section=doc.slice(start,end);
  const startMail=section.indexOf('](mailto:onecursor1@gmail.com?');
  assert.ok(startMail>0);
  const tail=section.slice(startMail+2);
  const full=tail.slice(0,tail.indexOf(')'));
  const url=new URL(full);
  assert.equal(url.protocol,'mailto:');
  assert.equal(url.pathname,'onecursor1@gmail.com');
  assert.ok(url.searchParams.get('subject').includes('Crypto CSV or Base USDC'));
  assert.ok(url.searchParams.get('body').includes('NO private transactions'));
  assert.ok(url.searchParams.get('body').includes('No payment or purchase'));
  assert.ok(section.includes('US$49 is a proposed starting budget'));
  assert.ok(section.includes('0 confirmed'));
});
test('the optional FormSubmit and public issue paths never claim the new synthetic QA email was delivered',()=>{
  assert.ok(doc.includes('delivery could not be verified'));
  assert.ok(doc.includes('may show an external anti-spam challenge'));
  assert.ok(doc.includes('GitHub scope form'));
  assert.ok(doc.includes('not a confirmed market price, checkout, client contract or existing customer order'));
  assert.ok(!doc.includes('already paid by new merchant'));
});
test('public issue dropdown identifies two real crypto services and warns about public information',()=>{
  assert.ok(issue.includes('Crypto exchange CSV / Koinly header mapping'));
  assert.ok(issue.includes('Base native Circle USDC invoice / Transfer event exceptions'));
  assert.ok(issue.includes('US$49 proposed pilot'));
  assert.ok(issue.includes('never send funds, tax records, wallet addresses or transaction history'));
  assert.ok(issue.includes('public-consent'));
  assert.ok(issue.includes('Never post passwords, wallet recovery phrases'));
  assert.ok(issue.includes('A submitted issue is not a funded order'));
});

test('firstparty HashN 5USDC mini-review actually linked and distinguished from broader 49-dollar hypothetical proposal',()=>{
  const h='https://hashn.com/store/886ed287-aaca-434b-9f27-560a50bfbbb6/listings/koinly-csv-one-source-mapping-mini-review-5usdc.md';
  assert.ok(doc.includes(h));
  assert.match(doc,/up to 10 buyer-authorized anonymized rows/);
  assert.match(doc,/zero external buyers, signed orders or final transfers are confirmed/);
  assert.match(doc,/buyer must voluntarily contact the seller and approve/);
  assert.match(doc,/entire free local converter remains free/);
  assert.match(doc,/separate from the broader 49-dollar/);
  assert.match(issue,/Small Koinly CSV mini-review \(proposed 5 native Base Circle USDC, up to 10 sanitized rows\)/);
});
