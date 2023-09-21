import axios from "axios";

async function recommendLanguages() {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.stackexchange.com/2.3/tags?&order=desc&sort=popular&site=stackoverflow`,
  };

  let recommendations: string[] = [];

  await axios.request(config)
    .then((response) => {
      if (response.data.items) {
        response.data.items.map((recommendation: any) => {
          recommendations.push(recommendation.name);
        });
      }
    })
    .catch((error) => {
      console.log("Error while fetching language recommendations", error);
    });
  
  console.log("Recommendations", recommendations);
  return recommendations;
}

export {
  recommendLanguages
}