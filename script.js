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

async function search(day0,day7) {
  const response = await axios.get(`https://v3.football.api-sports.io/fixtures?league=39&season=2024&from=${day0}&to=${day7}`, {
      
      headers: {"x-apisports-key": "95782220272b5bde20c7d5b97070ec44"},
  })
  // console.log(response.data);
  return response.data;
}

function getFormatDate() {
  // Get today's date
  const today = new Date();
  
  // Get the date 7 days from today
  const sevenDaysFromToday = new Date();
  sevenDaysFromToday.setDate(today.getDate() + 7);

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  // Return an object with both formatted dates
  return {
      today: formatDate(today),
      sevenDaysFromToday: formatDate(sevenDaysFromToday)
  };
}

document.addEventListener("DOMContentLoaded", async function(){



// Call the function and output the results
const dates = getFormatDate();
console.log("Today's Date: " + dates.today);
console.log("Date 7 Days From Today: " + dates.sevenDaysFromToday);

const data = await search(dates.today,dates.sevenDaysFromToday);
  // console.log(data.response.length);

  let output = document.querySelector("#output");
  // output.innerHTML = ''; // Clear the output element before appending new data

  for (let i = 0; i < data.response.length; i++) {
    const dateTimeString = data.response[i].fixture.date;
    console.log(dateTimeString);
    
    // Split the date-time string into date and time parts
    const [datePart, timePart] = dateTimeString.split("T");
    
    // Remove the time zone offset from the time part
    const timeWithoutOffset = timePart.split("+")[0];
    
    // console.log(datePart); // Output: "2024-08-31"
    // console.log(timeWithoutOffset); // Output: "11:30:00"
    const row = `
      <tr>
        <th scope="row">${datePart}<br>${timeWithoutOffset}</th>
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