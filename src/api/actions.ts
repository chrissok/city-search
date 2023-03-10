import haversineDistance from "haversine-distance";
import { Dictionary } from "../types/types";
import { cities } from "./mock-cities";

export const getCitiesByName = (keyword: string): Promise<any[]> => {
  const filteredCities = cities.filter((city: any) =>
    city[0].toLowerCase().includes(keyword.toLowerCase())
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        keyword.toLocaleLowerCase() === "fail" ||
        filteredCities.length === 0
      ) {
        reject("Please enter a valid city");
      } else {
        resolve(filteredCities);
      }
    }, 1000);
  });
};

export const calculateDistance = (cities: any[]) => {
  const mapCities: any = [];
  let error = false;
  let totalDistance = 0;

  cities.forEach((city, index) => {
    if (index === 0) return;

    const cityProp: Dictionary = {};

    if (city.name === "Dijon" || cities[index - 1].name === "Dijon") {
      error = true;
      return;
    }
    const cityA = cities[index - 1];
    const cityB = city;

    const a = { latitude: cityA.latitude, longitude: cityA.longitude };
    const b = { latitude: cityB.latitude, longitude: cityB.longitude };

    const distance = Math.trunc(haversineDistance(a, b) / 1000);

    cityProp.route = `${cityA.name}--${cityB.name}`;

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
