const urlParams = new URLSearchParams(window.location.search);
const data = JSON.parse(urlParams.get("data"));
console.log(data.fixture.id);
var myHeaders = new Headers();
myHeaders.append("x-apisports-key", "95782220272b5bde20c7d5b97070ec44");
// myHeaders.append("x-rapidapi-host", "sportapi7.p.rapidapi.com");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

async function fetchData() {
    const response = await axios.get(`https://v3.football.api-sports.io/fixtures?id=${data.fixture.id}`, {
        
        headers: {"x-apisports-key": "95782220272b5bde20c7d5b97070ec44"},
    })
    return response.data;
  }


  document.addEventListener("DOMContentLoaded", async function(){
    const output = document.querySelector("#liveMatch");
    output.innerHTML = ''; // Clear the output element before appending new data
  
    let data = await fetchData();
    console.log(data.response[0].goals.home, "vs" ,data.response[0].goals.away);
    if(data.response[0].fixture.status.short == "NS"){
      output.innerHTML = `
      <h1>Soccer Jalan</h1>
      <h1><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}   
        Vs
        <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  </h1><br>
        <h2>Match not yet started!</h2>
        
      `  
    }
    else{
      output.innerHTML = `
      <h1>Soccer Jalan</h1>
      <h1><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}  ${data.response[0].goals.home}  
        Vs
        <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  ${data.response[0].goals.away}</h1>
        
    `

    }
   
  
    setInterval(async () => {
      output.innerHTML = ''; // Clear the output element before appending new data

      data = await fetchData(); // Update the response variable
      console.log(data.response[0].goals.home, "vs" ,data.response[0].goals.away);
      if(data.response[0].fixture.status.short == "NS"){
        output.innerHTML = `
        <h1><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}   
          Vs
          <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  </h1><br>
          <h2>Match not yet started!</h2>
          
        `  
      }
      else{
        output.innerHTML = `
        <h1><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}  ${data.response[0].goals.home}  
          Vs
          <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  ${data.response[0].goals.away}</h1>
          
      `
  
      }

    }, 60000); // Call the function every 1 minute (60000 milliseconds)
  });