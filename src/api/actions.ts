import haversineDistance from "haversine-distance";
import { Dictionary } from "../types/types";
import { cities } from "./mock-cities";

export const getCitiesByName = (keyword: string): Promise<any[]> => {
  const filteredCities = cities.filter((city: any) =>
    city[0].includes(keyword)
  );

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
  const mapCities: any = [];
  let error = false;
  let totalDistance = 0;

  cities.forEach((city, index) => {
    if (index === 0) return;

    const cityProp: Dictionary = {};
    // if (city[0] === "Dijon") {
    //   error = true;
    //   return;
    // }
    const cityA = cities[index - 1];
    const cityB = city;

    const a = { latitude: cityA[1], longitude: cityA[2] };
    const b = { latitude: cityB[1], longitude: cityB[2] };

    const distance = Math.trunc(haversineDistance(a, b) / 1000);

    cityProp.route = `${cityA[0]}--${cityB[0]}`;

    cityProp.distance = `${distance} Km`;

    totalDistance = totalDistance + distance;

    mapCities.push(cityProp);
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(
          "We are unable to calculate the distance when the city 'Dijon' is involved, we apologize for the inconvenience"
        );
      } else {
        resolve([...mapCities, totalDistance]);
      }
    }, 2000);
  });
};
