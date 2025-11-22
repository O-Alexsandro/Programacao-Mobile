import { StyleSheet } from "react-native";
import { themes } from "@/global/themes";


export const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 5,

    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: themes.colors.white,
    }
})