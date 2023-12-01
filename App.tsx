import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { OPEN_WEATHER_API_KEY } from "@env";

interface locaType {
  lat: number;
  lon: number;
}

interface addressType {
  city: string | null;
  country: string | null;
  district: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  streetNumber: string | null;
  subregion: string | null;
  timezone: string | null;
}

export default function App() {
  const [location, setLocation] = useState<locaType>();
  const [cityData, setCityData] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>();
  const locationObject = {
    latitude: location?.lat || 0,
    longitude: location?.lon || 0,
  };

  useEffect(() => {
    getLocationCoords();
    weatherResp();
  }, []);

  const getLocationCoords = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    } else {
      const loca = await Location.getCurrentPositionAsync({});
      const lat = loca.coords.latitude;
      const lon = loca.coords.longitude;
      setLocation({ lat, lon });

      const [addressInfo]: addressType[] = await Location.reverseGeocodeAsync(
        locationObject
      );
      const updatedCityData = `${addressInfo.street}, ${addressInfo.region}`;
      setCityData(updatedCityData);
    }
  };

  const weatherResp = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${locationObject.latitude}&lon=${locationObject.longitude}&cnt=5&appid=${OPEN_WEATHER_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.cityWrap}>
        <Text style={styles.city}>{cityData}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.temp}>10</Text>
        <Text style={styles.weather}>Clear</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1357",
  },
  cityWrap: {
    flex: 3,
    alignItems: "center",
  },
  city: {
    padding: 30,
    fontSize: 34,
    fontWeight: "700",
  },
  body: {
    flex: 6,
    alignItems: "center",
    paddingTop: 30,
  },
  temp: {
    fontSize: 150,
    fontWeight: "700",
  },
  weather: {
    fontSize: 26,
    fontWeight: "500",
    marginTop: -20,
  },
});
