import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@/components/ui/CircularProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Cloud, Droplet, Link, Thermometer, Wind } from "lucide-react";

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

interface HourlyData {
  dt: number;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    "1h": number;
  };
  weather: Array<{
    description: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
  clouds: {
    all: number;
  };
}

const provinces = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

// Define el tipo para las métricas disponibles
type WeatherMetric =
  | "temperature"
  | "windSpeed"
  | "precipitation"
  | "humidity"
  | "clouds"
  | "feelsLike";

const LegendContent: React.FC<{ payload: any[] }> = ({ payload }) => (
  <div className="flex flex-col">
    {payload.map((entry, index) => (
      <div key={`item-${index}`} className="flex items-center space-x-2">
        <span
          className="block w-3 h-3"
          style={{ backgroundColor: entry.color }}
        ></span>
        <span className="text-sm text-stone-300">
          {entry.value === "temperature" && "Temperatura"}
          {entry.value === "windSpeed" && "Velocidad del viento"}
          {entry.value === "precipitation" && "Precipitaciones"}
          {entry.value === "humidity" && "Humedad"}
          {entry.value === "clouds" && "Nubosidad"}
          {entry.value === "feelsLike" && "Sensación Térmica"}
        </span>
      </div>
    ))}
  </div>
);

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [province, setProvince] = useState<string>("Buenos Aires");
  const [metric, setMetric] = useState<WeatherMetric>("temperature");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              q: `${province},ar`,
              units: "metric",
              appid: "d2f844ffb24842bd07f41b69c29bf881",
            },
          }
        );

        const hourlyData: HourlyData[] = response.data.list.slice(0, 12);

        setWeather({
          temperature: hourlyData[0].main.temp,
          windSpeed: hourlyData[0].wind.speed,
          precipitation: hourlyData[0].rain ? hourlyData[0].rain["1h"] : 0,
          description: hourlyData[0].weather[0].description,
          humidity: hourlyData[0].main.humidity,
          pressure: hourlyData[0].main.pressure,
          tempMax: hourlyData[0].main.temp_max,
          tempMin: hourlyData[0].main.temp_min,
          feelsLike: hourlyData[0].main.feels_like,
          sunrise: hourlyData[0].sys.sunrise,
          sunset: hourlyData[0].sys.sunset,
          clouds: hourlyData[0].clouds.all,
        });

        const data = hourlyData.map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: item.main.temp,
          windSpeed: item.wind.speed,
          precipitation: item.rain ? item.rain["1h"] : 0,
          humidity: item.main.humidity,
          clouds: item.clouds.all,
          feelsLike: item.main.feels_like,
        }));

        // Asegúrate de que metric sea una clave válida
        setTemperatureHistory(data.map((d) => d[metric]));
        setTimeLabels(data.map((d) => d.time));
      } catch (err) {
        setError("Error al intentar obtener datos meteorológicos");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 600000);

    return () => clearInterval(intervalId);
  }, [province, metric]);

  if (loading) return <CircularProgress />;
  if (error) return <div className="flex flex-col text-red-400 text-3xl font-light">
    {error}
    <a href="/" className="border px-4 py-2 rounded-[4px] text-white text-xl bg-slate-900 hover:bg-slate-800  m-auto mt-10">Volver a la App</a>
  </div>;

  // Datos para el gráfico
  const chartData = timeLabels.map((time, index) => ({
    time,
    [metric]: temperatureHistory[index] || 0,
  }));

  // Colores para las métricas
  const metricColors: { [key in WeatherMetric]: string } = {
    temperature: "#EBC35E",
    windSpeed: "#76C7C5",
    precipitation: "#69A1F4",
    humidity: "#A1C8F4",
    clouds: "#C4C4C4",
    feelsLike: "#FF6F61",
  };

  return (
    <Card className="rounded-2xl">
      <CardContent>
        <h1 className="pt-12 text-center text-5xl font-black text-stone-300">
          Nimbus
        </h1>
        <h1 className="mb-8 text-center text-xs text-stone-500">Datos meteorologicos de {province}</h1>
        {/* Selección de Provincia */}
        <div className="mb-6">
          <Select onValueChange={setProvince}>
            <SelectTrigger className="w-full text-gray-400">
              <SelectValue
                placeholder="Seleccione una provincia"
                className=""
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-amber-200">Provincias</SelectLabel>
                {provinces.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Secciones Climaticas */}

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("temperature")}
            >
              <Thermometer className="text-amber-400" size={24} />
              <div>
                <div className="text-lg font-semibold">
                  {weather.temperature}°C
                </div>
                <div className="text-stone-300 font-thin">Temperatura</div>
              </div>
            </section>

            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("windSpeed")}
            >
              <Wind className="text-teal-500" size={24} />
              <div>
                <div className="text-lg font-semibold">
                  {weather.windSpeed} m/s
                </div>
                <div className="text-stone-300 font-thin">Vel. del viento</div>
              </div>
            </section>

            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("precipitation")}
            >
              <Droplet className="text-blue-400/80" size={24} />
              <div>
                <div className="text-lg font-semibold">
                  {weather.precipitation} mm
                </div>
                <div className="text-stone-300 font-thin">Precipitaciones</div>
              </div>
            </section>

            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("humidity")}
            >
              <Droplet className="text-stone-500/60" size={24} />
              <div>
                <div className="text-lg font-semibold">{weather.humidity}%</div>
                <div className="text-stone-300 font-thin">Humedad</div>
              </div>
            </section>

            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("clouds")}
            >
              <Cloud className="text-stone-300 font-thin" size={24} />
              <div>
                <div className="text-lg font-semibold">{weather.clouds}%</div>
                <div className="text-stone-300 font-thin">Nubosidad</div>
              </div>
            </section>

            <section
              className="p-4 border rounded-full flex items-center space-x-4 shadow-md cursor-pointer"
              onClick={() => setMetric("feelsLike")}
            >
              <Thermometer className="text-blue-400" size={24} />
              <div>
                <div className="text-lg font-semibold">
                  {weather.feelsLike}°C
                </div>
                <div className="text-stone-300 font-thin">Sens. Térmica</div>
              </div>
            </section>
          </div>
        )}

        {/* Gráfico con las métricas diarias */}
        <div className="mt-8">
          <h2 className="text-center text-xl font-extralight text-slate-400 mb-4">
            Tendencia
          </h2>

          <div className="">
            <ChartContainer config={{}} className="h-[200px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<LegendContent payload={[]} />} />
                <Bar dataKey={metric} fill={metricColors[metric]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
