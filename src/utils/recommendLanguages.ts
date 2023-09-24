import axios from 'axios';

async function recommendLanguages(languageParam: string) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.stackexchange.com/2.3/tags?&order=desc&sort=popular&site=stackoverflow${
      languageParam && `&inname=${languageParam}`
    }`,
  };

  console.log('API getting triggered', languageParam);

  let recommendations: RecommendationType[] = [];

  await axios
    .request(config)
    .then((response: any) => {
      if (response.data.items) {
        response.data.items.map((recommendation: any) => {
          recommendations.push({
            label: recommendation.name,
            value: recommendation.name,
          });
        });
      }
    })
    .catch((error) => {
      console.error('Error while fetching language recommendations', error);
    });

  console.info('Recommendations', recommendations);
  return recommendations;
}

export { recommendLanguages };
