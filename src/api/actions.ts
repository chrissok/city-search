import haversineDistance from "haversine-distance";
import { cities } from "./mock-cities";

export const getCitiesByName = (keyword: string): Promise<any[]> => {
  const filteredCities = cities.filter((city) => city[0] === keyword);

//  const mapCities = filteredCities.map((city) => ({
//     city: city[0],
//     latitude: city[1],
//     longitude: city[2],
//   }));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (keyword === "fail" || filteredCities.length === 0) {
        reject("Please enter a valid city");
      } else {
        resolve(filteredCities);
      }
    }, 2000);
  });
};

export const calculateDistance = (cities: any[]) => {
  const mapCities: any = {};
  let error = false;

  cities.forEach((city, index) => {
    if (index === 0) return;
    if (city[0] === "Dijon") {
      error = true;
      return;
    }
    const cityA = cities[index - 1];
    const cityB = city;

    const a = { latitude: cityA[1], longitude: cityA[2] };
    const b = { latitude: cityB[1], longitude: cityB[2] };

    mapCities[`${cityA[0]}--${cityB[0]}`] = `${Math.trunc(
      haversineDistance(a, b) / 1000
    )} Km`;
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(
          "We are unable to calculate the distance when the city 'Dijon' is involved, we apologize for the inconvenience"
        );
      } else {
        resolve(mapCities);
      }
    }, 2000);
  });
};
