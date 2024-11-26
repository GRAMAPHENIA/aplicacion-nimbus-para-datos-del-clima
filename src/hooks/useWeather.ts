// hooks/useWeather.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  humidity: number;
  pressure: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  sunrise: number;
  sunset: number;
  clouds: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [windSpeedHistory, setWindSpeedHistory] = useState<number[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: "Buenos Aires,ar",
              units: "metric",
              appid: "d2f844ffb24842bd07f41b69c29bf881", // Reemplaza con tu API Key
            },
          }
        );

        setWeather({
          temperature: response.data.main.temp,
          windSpeed: response.data.wind.speed,
          precipitation: response.data.rain ? response.data.rain["1h"] : 0,
          description: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          pressure: response.data.main.pressure,
          tempMax: response.data.main.temp_max,
          tempMin: response.data.main.temp_min,
          feelsLike: response.data.main.feels_like,
          sunrise: response.data.sys.sunrise,
          sunset: response.data.sys.sunset,
          clouds: response.data.clouds.all,
        });

        setTemperatureHistory((prev) =>
          [...prev, response.data.main.temp].slice(-60)
        );
        setWindSpeedHistory((prev) =>
          [...prev, response.data.wind.speed].slice(-60)
        );
      } catch (err) {
        setError("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  return { weather, loading, error, temperatureHistory, windSpeedHistory };
};
