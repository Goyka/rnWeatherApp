import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cityWrap}>
        <Text style={styles.city}>Seoul</Text>
        <View style={styles.newsWrap}>
          <Text style={styles.news}>somthing happened</Text>
        </View>
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
  newsWrap: {
    backgroundColor: "#ffffff",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  news: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
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
