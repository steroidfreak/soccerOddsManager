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

async function getEPLData(){

  let response = await axios.get("epl.json")
  console.log(response.data);
  return response.data;
}

// Function to calculate probability
function calculateProbability(data, homeTeam, awayTeam, newHomeScore, newAwayScore) {
  // Filter matches with the same Home Team and Away Team
  const relevantMatches = data.filter(match => 
      match.Home.toLowerCase() === homeTeam.toLowerCase() && 
      match.Away.toLowerCase() === awayTeam.toLowerCase()
  );

  // Check the outcomes
  const results = relevantMatches.map(match => {
      if (match.HomeGoals > match.AwayGoals) {
          return 'HomeWin';
      } else if (match.HomeGoals < match.AwayGoals) {
          return 'AwayWin';
      } else {
          return 'Draw';
      }
  });

  // Determine the new match result
  let newResult;
  if (newHomeScore > newAwayScore) {
      newResult = 'HomeWin';
  } else if (newHomeScore < newAwayScore) {
      newResult = 'AwayWin';
  } else {
      newResult = 'Draw';
  }

  // Count the occurrences of each result
  const resultCounts = results.reduce((acc, result) => {
      acc[result] = (acc[result] || 0) + 1;
      return acc;
  }, {});

  // Calculate the probability
  const totalMatches = relevantMatches.length;
  const probability = resultCounts[newResult] / totalMatches || 0;

  // Return the probability in percentage
  return probability * 100;
}

// Function to generate all possible score combinations (e.g., 0-0, 1-0, etc.)
function generateScoreCombinations(maxGoals = 10) {
  const combinations = [];
  for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals++) {
      for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals++) {
          combinations.push({ homeGoals, awayGoals });
      }
  }
  return combinations;
}

// Function to calculate the probabilities of each score combination
function calculateScoreProbabilities(data, homeTeam, awayTeam, maxGoals = 10) {
    // Filter matches with the same Home Team and Away Team
    const relevantMatches = data.filter(match => 
        match.Home.toLowerCase() === homeTeam.toLowerCase() && 
        match.Away.toLowerCase() === awayTeam.toLowerCase()
    );

    // Generate all possible score combinations
    const scoreCombinations = generateScoreCombinations(maxGoals);

    // Count occurrences of each score combination
    const scoreCounts = scoreCombinations.reduce((acc, combo) => {
        const key = `${combo.homeGoals}-${combo.awayGoals}`;
        acc[key] = relevantMatches.filter(match => 
            match.HomeGoals === combo.homeGoals && match.AwayGoals === combo.awayGoals
        ).length;
        return acc;
    }, {});

    // Calculate the probability of each score combination
    const totalMatches = relevantMatches.length;
    const probabilities = scoreCombinations.map(combo => {
        const key = `${combo.homeGoals}-${combo.awayGoals}`;
        const probability = (scoreCounts[key] / totalMatches) * 100 || 0;
        return {
            score: key,
            probability: probability.toFixed(2)
        };
    });

    return probabilities;
}


// Function to calculate the probabilities of all outcomes
function calculateOutcomeProbabilities(data, homeTeam, awayTeam) {
  // Filter matches with the same Home Team and Away Team
  const relevantMatches = data.filter(match => 
      match.Home.toLowerCase() === homeTeam.toLowerCase() && 
      match.Away.toLowerCase() === awayTeam.toLowerCase()
  );

  // Check the outcomes and count occurrences
  const results = relevantMatches.map(match => {
      if (match.HomeGoals > match.AwayGoals) {
          return 'HomeWin';
      } else if (match.HomeGoals < match.AwayGoals) {
          return 'AwayWin';
      } else {
          return 'Draw';
      }
  });

  // Count the occurrences of each result
  const resultCounts = results.reduce((acc, result) => {
      acc[result] = (acc[result] || 0) + 1;
      return acc;
  }, { HomeWin: 0, AwayWin: 0, Draw: 0 });

  // Calculate the probability of each outcome
  const totalMatches = relevantMatches.length;
  const probabilities = {
      HomeWin: (resultCounts.HomeWin / totalMatches) * 100 || 0,
      AwayWin: (resultCounts.AwayWin / totalMatches) * 100 || 0,
      Draw: (resultCounts.Draw / totalMatches) * 100 || 0
  };

  // Find the outcome with the highest probability
  const highestProbabilityOutcome = Object.keys(probabilities).reduce((a, b) => 
      probabilities[a] > probabilities[b] ? a : b
  );

  return { probabilities, highestProbabilityOutcome };
}

  document.addEventListener("DOMContentLoaded", async function(){
    const output = document.querySelector("#liveMatch");
    output.innerHTML = ''; // Clear the output element before appending new data
  
    let data = await fetchData();
    let eplData = await getEPLData();
    for(let x of eplData){
      if(x.Home == "Liverpool"){
        console.log(x.Home,"vs",x.Away)
      }

    }
    // let result = calculateProbability(eplData,"Liverpool","Arsenal","0","0");
    let result = calculateOutcomeProbabilities(eplData,data.response[0].teams.home.name,data.response[0].teams.away.name);
    console.log(result.probabilities.HomeWin, result.probabilities.Draw,result.probabilities.AwayWin);
    const probabilities = calculateScoreProbabilities(eplData,data.response[0].teams.home.name,data.response[0].teams.away.name);
    console.log(probabilities[0].score,probabilities[0].probability);
    // console.log(data.response[0].goals.home, "vs" ,data.response[0].goals.away);
    if(data.response[0].fixture.status.short == "NS"){
      output.innerHTML = `
      <h1>Soccer Jalan</h1>
      <h2><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}   
        Vs
        <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  </h2><br>
        <h2>Match not yet started!</h2>
        
      `  
    }
    else{
      output.innerHTML = `
      <h1>Soccer Jalan</h1>
      <h2><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}  ${data.response[0].goals.home}  
        Vs
        <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  ${data.response[0].goals.away}</h2>
        <h2>HomeWin:${result.probabilities.HomeWin},  Draw:${result.probabilities.Draw},  AwayWin:${result.probabilities.AwayWin}
        
        <h3>Proposed betting tips Jalan on the fly!</h3>
        <h5>${probabilities[0].score}, ${probabilities[0].probability}</h5>
        <h5>${probabilities[1].score}, ${probabilities[1].probability}</h5>
        <h5>${probabilities[2].score}, ${probabilities[2].probability}</h5>
        <h5>${probabilities[3].score}, ${probabilities[3].probability}</h5>
        <h5>${probabilities[4].score}, ${probabilities[4].probability}</h5>
        <h5>${probabilities[5].score}, ${probabilities[5].probability}</h5>
    `

    }
   
  
    setInterval(async () => {
      output.innerHTML = ''; // Clear the output element before appending new data

      data = await fetchData(); // Update the response variable
      console.log(data.response[0].goals.home, "vs" ,data.response[0].goals.away);
      if(data.response[0].fixture.status.short == "NS"){
        output.innerHTML = `
        <h1>Soccer Jalan</h1>
        <h2><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}   
          Vs
          <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  </h2><br>
          <h2>Match not yet started!</h2>
          
        `  
      }
      else{
        output.innerHTML = `
        <h1>Soccer Jalan</h1>
        <h2><img src="${data.response[0].teams.home.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.home.name}  ${data.response[0].goals.home}  
          Vs
          <img src="${data.response[0].teams.away.logo}" style="width: 100%; height: auto; max-width: 50px;">${data.response[0].teams.away.name}  ${data.response[0].goals.away}</h2>
        <h2>HomeWin:${result.probabilities.HomeWin},  Draw:${result.probabilities.Draw},  AwayWin:${result.probabilities.AwayWin}
                <h3>Proposed betting tips Jalan on the fly!</h3>
        <h5>${probabilities[0].score}, ${probabilities[0].probability}</h5>
        <h5>${probabilities[1].score}, ${probabilities[1].probability}</h5>
        <h5>${probabilities[2].score}, ${probabilities[2].probability}</h5>
        <h5>${probabilities[3].score}, ${probabilities[3].probability}</h5>
        <h5>${probabilities[4].score}, ${probabilities[4].probability}</h5>
        <h5>${probabilities[5].score}, ${probabilities[5].probability}</h5>  

      `
  
      }

    }, 60000); // Call the function every 1 minute (60000 milliseconds)
  });