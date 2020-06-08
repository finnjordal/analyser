"use strict";

let rp= require('request-promise');

async function main() {

  let sbnavne= 0
    , aa1= 0
    , aa2= 0;

  let options1= {};
  options1.url='https://dawa-p1.aws.dk/supplerendebynavne';
  options1.qs= {};
  options1.qs.format= 'json';
  //options1.resolveWithFullResponse= true; 

  let options2= {};
  options2.url='https://dawa-p2.aws.dk/supplerendebynavne';
  options2.qs= {};
  options2.qs.format= 'json';
  //options2.resolveWithFullResponse= true; 

  let results= await Promise.all([rp(options1), rp(options2)]);

  let dawap1= JSON.parse(results[0]);
  let dawap2= JSON.parse(results[1]);

  console.log('dawa-p1: ' + dawap1.length);
  console.log('dawa-p2: ' + dawap2.length);

  if (dawap1.length != dawap2.length) {
    console.log('Forsklliget antal supplerende bynavne. p1: ' + dawap1.length + 'p2: ' + dawap2.length);
    return;
  }

  for (let i= 0; i<dawap1.length; i++) {
    sbnavne++;
    if (sbnavne%100 === 0) {
      console.log(sbnavne + ' supplerende bynavne, ' + dawap1[i].navn);
    }
    if (dawap1[i].navn !== dawap2[i].navn) {
      console.log('Navnet er forskelligt p1: ' + dawap1[i].navn + 'p2: ' + dawap2[i].navn);
    }
    if (dawap1[i].kommuner.length != dawap2[i].kommuner.length) {
      console.log('Forsklliget antal kommuner for ' + dawap1[i].navn + '. p1: ' + dawap1[i].kommuner.length + 'p2: ' + dawap2[i].kommuner.length);
    }
    for (let j= 0; j<dawap1[i].kommuner.length; j++) {
      if (dawap1[i].kommuner[j].kode !== dawap2[i].kommuner[j].kode ) {
      console.log('Forsklliget antal kommuner for ' + dawap1[i].navn + '. p1: ' + dawap1[i].kommuner[j].kode + 'p2: ' + dawap2[i].kommuner[j].kode);
      }
    }

    let aoptions1= {};
    aoptions1.url='https://dawa-p1.aws.dk/adgangsadresser';
    aoptions1.qs= {};
    aoptions1.qs.supplerendebynavn= dawap1[i].navn;
    aoptions1.qs.format= 'json';
    //aoptions1.resolveWithFullResponse= true; 

    let aoptions2= {};
    aoptions2.url='https://dawa-p2.aws.dk/adgangsadresser';
    aoptions2.qs= {};
    aoptions2.qs.supplerendebynavn= dawap1[i].navn;
    aoptions2.qs.format= 'json';
    //aoptions2.resolveWithFullResponse= true; 


    let results= await Promise.all([rp(aoptions1), rp(aoptions2)]);
    let aap1= JSON.parse(results[0]);
    let aap2= JSON.parse(results[1]);

    //console.log('dawa-p1: ' + aap1.length);
    //console.log('dawa-p2: ' + aap2.length);

    aa1= aa1+aap1.length;
    aa2= aa2+aap2.length;

    if (aap1.length != aap2.length) {
      console.log('Forsklliget antal adgangsadresser for ' + dawap1[i].navn + '. p1: ' + aap1.length + 'p2: ' + aap2.length);
    }
  }
  console.log('supplerende bynavne: ' + sbnavne + ', adgangsadreser p1: ' + aa1 + ', adgangsadreser p2: ' + aa2);
}

main();