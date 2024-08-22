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
  const response = await axios.get("https://v3.football.api-sports.io/fixtures?league=39&season=2024&from=2024-08-23&to=2024-08-30", {
      
      headers: {"x-apisports-key": "95782220272b5bde20c7d5b97070ec44"},
  })
  console.log(response.data);
  return response.data;
}

document.addEventListener("DOMContentLoaded", async function(){
  const data = await search();

  let output = document.querySelector("#soccer");
  output.innerHTML = ''; // Clear the output element before appending new data

  for(let x of data.response){
    console.log(x.teams.home.name, x.teams.away.name);
    output.innerHTML += `<h3><img src="${x.teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${x.teams.home.name} vs <img src="${x.teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${x.teams.away.name}</h3><br>`;
  }
});