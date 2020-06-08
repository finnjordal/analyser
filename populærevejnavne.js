
   const fetch = require('node-fetch');


async function getvejnavne(titel, url) {
  
  // var params = {
  //     'type-filter': 'inetnum',
  //     'resource': '',
  //     'query-string': ipadr
  // };

  // url.search = new URLSearchParams(params).toString();

  const response= await fetch(url.toString());
  const navngivneveje= await response.json();
  console.log('Antal %s: %d', titel, navngivneveje.length);
  let vejnavne= new Map();
  for (const navngivenvej of navngivneveje) {
    let antal= vejnavne.get(navngivenvej.navn);
    if (antal) {
      antal++;
    }
    else {
      antal= 1;
    }
    vejnavne.set(navngivenvej.navn, antal);
  }

  function compare(a, b) {
    let result= b[1] - a[1];
    if (result!=0) {
      return result;
    }
    else {
      return a[0].localeCompare(b[0]);
    }
  }

  let vnarray= Array.from(vejnavne);
  vnarray.sort(compare);

  for (let i= 0; i<100; i++) {
    let vejnavn= vnarray[i];
    console.log('%d. %s: %d', i+1, vejnavn[0], vejnavn[1]);
  }

  return vnarray;
}

async function main() {
  let navngivneveje= await getvejnavne('Navngivne veje', new URL('https://dawa.aws.dk/navngivneveje'));
  let vejstykker= await getvejnavne('Vejstykker', new URL('https://dawa.aws.dk/vejstykker'));
  console.log('navngivneveje: %d, vejstykker: %d', navngivneveje.length, vejstykker.length);

  let length= Math.min(navngivneveje.length, vejstykker.length);

  for (let i= 0; i<100; i++) {
    if (!(navngivneveje[i][0]===vejstykker[i][0] && navngivneveje[i][1]===vejstykker[i][1]))  {
      console.log('Navngivneveje %d. %s: %d. Vejstykker %d. %s: %d', i+1, navngivneveje[i][0], navngivneveje[i][1], i+1, vejstykker[i][0], vejstykker[i][1]);
    }

  }
}

main();