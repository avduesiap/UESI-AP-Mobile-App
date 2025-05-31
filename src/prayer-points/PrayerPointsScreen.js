import React from "react";
import { 
  View, 
  Text, 
  Linking, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView 
} from "react-native";

const PrayerPointsScreen = () => {
    const handlePress = () => {
        Linking.openURL("https://forms.gle/Pv4nYwViBz8wbiHu5")
          .catch(() => alert("Could not open the link. Please try again later."));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handlePress}
                    accessibilityLabel="Submit prayer points"
                    accessibilityHint="Opens a form to submit your prayer requests"
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>
                        Send Your Prayer Points To <Text style={{fontWeight: 'bold'}}>Our Field</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    // title: {
    //     fontSize: 22,
    //     fontWeight: "600",
    //     color: "#343a40",
    //     marginBottom: 12,
    //     textAlign: "center",
    // },
    // description: {
    //     fontSize: 16,
    //     color: "#6c757d",
    //     textAlign: "center",
    //     marginBottom: 32,
    //     lineHeight: 24,
    //     maxWidth: "80%",
    // },
    button: {
        backgroundColor: "#4267B2",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#fff",
    },
});

export default PrayerPointsScreen;