var myHeaders = new Headers();
myHeaders.append("x-apisports-key", "95782220272b5bde20c7d5b97070ec44");
// myHeaders.append("x-rapidapi-host", "sportapi7.p.rapidapi.com");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// fetch("https://v3.football.api-sports.io/leagues", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

// console.log(data.response[0].league.id);

async function search() {
  const response = await axios.get("https://v3.football.api-sports.io/leagues", {
      
      headers: {"x-apisports-key": "95782220272b5bde20c7d5b97070ec44"},
  })
  return response.data;
}

document.addEventListener("DOMContentLoaded", async function(){

  let data = await search();

  for(let x of data.response){

    console.log(x.league.id,x.league.name);
    
  }
})
