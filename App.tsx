import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useEffect, useState } from "react";

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
  const [temp, setTemp] = useState<number>(0);
  const [desc, setDesc] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [coord, setCoord] = useState<{
    lat: number;
    lon: number;
  }>({ lat: 0, lon: 0 });

  useEffect(() => {
    getLocationCoords();
    weatherResp();
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
        `https://api.openweathermap.org/data/2.5/forecast?lat=${locationObject.latitude}&lon=${locationObject.longitude}&cnt=5&units=metric&appid=faf4bdb03e4e7c4f63054d20e84d697a`
      );
      const data = await response.json();
      setLevel(data.list[0].main.grnd_level);
      setCoord(data.city.coord);
      setDesc(data.list[0].weather[0].description);
      setTemp(data.list[0].main.feels_like.toFixed(0));
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.cityWrap}>
        <Text style={styles.city}>{cityData}</Text>
        <Text style={styles.coords}>
          {coord.lat}* {coord.lon}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.subWrap}>
          <Text style={styles.subtitles}>Realtime feel Temp</Text>
        </View>
        <Text style={styles.temp}>{temp}°</Text>
        <Text style={styles.weather}>{desc}</Text>
        <Text style={styles.groundLevel}>{level}m</Text>
        <MapView
          style={styles.map}
          region={{
            latitude: coord.lat,
            longitude: coord.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          mapType="mutedStandard"
        >
          <Marker
            coordinate={{ latitude: coord.lat, longitude: coord.lon }}
            image={{ uri: "custom_pin" }}
          />
        </MapView>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
  },
  cityWrap: {
    flex: 1.2,
    alignItems: "center",
  },
  city: {
    paddingTop: 50,
    fontSize: 34,
    fontWeight: "700",
    color: "#202020",
  },
  body: {
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
