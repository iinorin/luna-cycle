import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Image,
} from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, AlertTriangle } from "lucide-react-native";

export default function PainScreen() {
    const [selected, setSelected] = useState<"none" | "pain" | null>(null);
    const [saved, setSaved] = useState(false);

    const scaleNoPain = useRef(new Animated.Value(1)).current;
    const scalePain = useRef(new Animated.Value(1)).current;

    const animatePress = (scale: Animated.Value) => {
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 0.94,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const isSaveEnabled = selected !== null;

    const handleSave = () => {
        if (!selected) return;

        // Later: storage / navigation logic
        setSaved(true);
    };

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <LinearGradient
                colors={["#1f2937", "#000000"]}
                style={styles.headerCard}
            >
                <Text style={styles.headerTitle}>Pain Today</Text>
                <Text style={styles.headerSubtitle}>
                    Let us know how you feel right now
                </Text>
            </LinearGradient>

            {/* Icon Buttons */}
            <View style={styles.iconRow}>
                {/* No Pain */}
                <Pressable
                    onPress={() => {
                        setSelected("none");
                        setSaved(false);
                        animatePress(scaleNoPain);
                    }}
                >
                    <Animated.View
                        style={[
                            styles.iconWrapper,
                            selected === "none" && styles.activeNoPain,
                            { transform: [{ scale: scaleNoPain }] },
                        ]}
                    >
                        <CheckCircle2
                            size={52}
                            color={selected === "none" ? "#22c55e" : "#9ca3af"}
                        />
                        <Text
                            style={[
                                styles.iconLabel,
                                selected === "none" && styles.activeLabel,
                            ]}
                        >
                            No Pain
                        </Text>
                    </Animated.View>
                </Pressable>

                {/* Pain */}
                <Pressable
                    onPress={() => {
                        setSelected("pain");
                        setSaved(false);
                        animatePress(scalePain);
                    }}
                >
                    <Animated.View
                        style={[
                            styles.iconWrapper,
                            selected === "pain" && styles.activePain,
                            { transform: [{ scale: scalePain }] },
                        ]}
                    >
                        <AlertTriangle
                            size={52}
                            color={selected === "pain" ? "#ef4444" : "#9ca3af"}
                        />
                        <Text
                            style={[
                                styles.iconLabel,
                                selected === "pain" && styles.activeLabel,
                            ]}
                        >
                            Pain
                        </Text>
                    </Animated.View>
                </Pressable>
            </View>

            {/* Save Button */}
            <Pressable
                disabled={!isSaveEnabled}
                style={[
                    styles.saveButton,
                    isSaveEnabled ? styles.saveActive : styles.saveDisabled,
                ]}
                onPress={handleSave}
            >
                <Text
                    style={[
                        styles.saveText,
                        !isSaveEnabled && styles.saveTextDisabled,
                    ]}
                >
                    Save
                </Text>
            </Pressable>

            {/* No Pain Message & GIF (ONLY after Save) */}
            {saved && selected === "none" && (
                <View style={styles.noPainContainer}>
                    <View style={styles.noPainTitleRow}>
                        <Text style={styles.noPainTitle}>Yay! No pain today</Text>
                        <Text style={styles.noPainEmoji}>💖</Text>
                    </View>

                    <Text style={styles.noPainSubtitle}>
                        Hope it stays this way — take care of yourself
                    </Text>

                    <Image
                        source={{
                            uri: "https://media1.tenor.com/m/mufcZq84L18AAAAd/pain-go-away.gif",
                        }}
                        style={styles.noPainGif}
                    />
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#000000",
    },

    headerCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 40,
        marginTop: 90,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#ffffff",
    },

    headerSubtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#9ca3af",
    },

    iconRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 50,
    },

    iconWrapper: {
        width: 140,
        height: 140,
        borderRadius: 20,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
    },

    iconLabel: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: "600",
        color: "#9ca3af",
    },

    activeNoPain: {
        backgroundColor: "#052e16",
        borderWidth: 1,
        borderColor: "#22c55e",
    },

    activePain: {
        backgroundColor: "#450a0a",
        borderWidth: 1,
        borderColor: "#ef4444",
    },

    activeLabel: {
        color: "#ffffff",
    },

    saveButton: {
        height: 52,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    saveActive: {
        backgroundColor: "#ec4899",
    },

    saveDisabled: {
        backgroundColor: "#1f2937",
    },

    saveText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },

    saveTextDisabled: {
        color: "#6b7280",
    },

    noPainContainer: {
        marginTop: 30,
        alignItems: "center",
    },

    noPainTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 6,
    },

    noPainTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6, 
    },

    noPainEmoji: {
        fontSize: 20,
    },


    noPainSubtitle: {
        fontSize: 14,
        color: "#9ca3af",
        marginBottom: 16,
        textAlign: "center",
        paddingHorizontal: 20,
    },

    noPainGif: {
        width: 200,
        height: 200,
        borderRadius: 16,
    },
});
