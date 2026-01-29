import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import PainScreen from "./PainScreen";
import PainDetails from "./PainDetails";
import { loadTodayPain, PainSelection } from "./painDailyStorage";

export default function PainController() {
  const [stage, setStage] = useState<"loading" | "selection" | "details">("loading");
  const [initialChoice, setInitialChoice] = useState<PainSelection | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await loadTodayPain();
      if (saved === "pain") {
        setStage("details");
      } else {
        setStage("selection");
      }
    })();
  }, []);

  if (stage === "loading") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  if (stage === "selection") {
    return (
      <PainScreen 
        onSelectPain={() => setStage("details")} 
      />
    );
  }

  return (
    <PainDetails 
      onBack={() => setStage("selection")} 
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }
});