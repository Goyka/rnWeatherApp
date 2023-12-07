import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import axios from "axios";
import { OPEN_WEATHER_API } from "../../Key";

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

function Main() {
  const [location, setLocation] = useState<locaType>();
  const [cityData, setCityData] = useState<string>("");
  const [temp, setTemp] = useState<number>(0);
  const [desc, setDesc] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [, setRefr] = useState(0);
  const [coord, setCoord] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  const API_KEY = OPEN_WEATHER_API;

  useEffect(() => {
    const fetchData = async () => {
      await getLocationCoords();
      if (location) {
        weatherResp();
      }
    };
    fetchData();
  }, []);

  const locationObject = {
    latitude: location?.lat || 0,
    longitude: location?.lon || 0,
  };

  const getLocationCoords = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    } else {
      const loca = await Location.getCurrentPositionAsync();
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
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationObject.latitude}&lon=${locationObject.longitude}&cnt=1&units=metric&appid=${API_KEY}`
      );
      setLevel(response.data.list[0].main.grnd_level);
      setCoord(response.data.city.coord);
      setDesc(response.data.list[0].weather[0].description);
      setTemp(response.data.list[0].main.feels_like.toFixed(0));
    } catch (error) {
      console.error(error);
    }
  };

  const refreshWindow = () => {
    setRefr((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cityWrap}>
        <View style={styles.refr}>
          <Text style={styles.city}>{cityData}</Text>
        </View>
        <Text style={styles.coords}>
          {coord.lat}* {coord.lon}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.subWrap}>
          <Text style={styles.subtitles}>Temperature feels like</Text>
        </View>
        <Text style={styles.temp}>{temp}°</Text>
        <Text style={styles.weather}>{desc}</Text>
        <Text style={styles.groundLevel}>{level}m</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: coord.lat,
            longitude: coord.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="mutedStandard"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    backgroundColor: "#ffffff",
  },
  cityWrap: {
    flex: 1.2,
    alignItems: "center",
  },
  refr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  city: {
    fontSize: 34,
    fontWeight: "700",
    color: "#202020",
  },
  body: {
    marginTop: -30,
    flex: 6,
    alignItems: "center",
  },
  coords: {
    fontSize: 18,
    fontWeight: "700",
    color: "#202020",
  },
  temp: {
    fontSize: 130,
    fontWeight: "700",
    color: "#202020",
  },
  weather: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: -20,
    color: "#202020",
  },
  groundLevel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#202020",
  },
  subWrap: {
    backgroundColor: "#202020",
    borderRadius: 40,
    marginBottom: -14,
  },
  subtitles: {
    fontSize: 18,
    fontWeight: "700",
    color: "#eeeeee",
    padding: 8,
    paddingHorizontal: 16,
  },
  map: {
    borderRadius: 40,
    marginTop: 34,
    width: "80%",
    height: "60%",
  },
});
