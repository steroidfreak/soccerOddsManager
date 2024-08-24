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
  // console.log(response.data);
  return response.data;
}

document.addEventListener("DOMContentLoaded", async function(){
  const data = await search();
  // console.log(data.response.length);

  let output = document.querySelector("#output");
  // output.innerHTML = ''; // Clear the output element before appending new data

  for (let i = 0; i < data.response.length; i++) {
    const dateString = data.response[i].fixture.date;
    const datePart = dateString.split("T")[0];
    // console.log(datePart); // Output: "2024-08-25"
    const row = `
      <tr>
        <th scope="row">${datePart}</th>
        <td><img src="${data.response[i].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[i].teams.home.name}</td>
        <td>Vs</td>
        <td><img src="${data.response[i].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[i].teams.away.name}</td>
        <td><button class="btn btn-primary" data-index="${i}">View Match</button></td>
      </tr>
    `;
    output.innerHTML += row;
  }
  
  output.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn")) {
      const index = event.target.dataset.index;
      const selectedData = data.response[index];
      console.log(selectedData);
    // Navigate to index2.html and pass the selected data as a query parameter
    window.location.href = `live_match.html?data=${JSON.stringify(selectedData)}`;
    }

  });
    
  
});

function render_list(data){

  let match = data;
  let employer_list = document.querySelector("#output")
  let employerData = "";
  // employer_list.innerHTML = "";s
  

  let parent = document.querySelector("#output");
  
  for(let i=0; i<10; i++){
      employerData = document.createElement('tr');
      employerData.className = 'table-group-item';
  
      employerData.innerHTML = `
      <tr>
          <td>${match.response[i].teams.home.name} </td>
          <td>vs </td>
          <td>(${match.response[i].teams.away.name})</td>

      </tr> `;

      parent.appendChild(employerData);    

  }


  


}