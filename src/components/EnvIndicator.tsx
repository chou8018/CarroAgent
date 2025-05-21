// import React from "react";
// import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
// import { config } from "../config/env";

// type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

// interface EnvIndicatorProps {
//   position?: Position;
//   style?: ViewStyle;
//   textStyle?: TextStyle;
// }

// const EnvIndicator: React.FC<EnvIndicatorProps> = ({
//   position = "top-right",
//   style,
//   textStyle,
// }) => {
//   // 确保这里使用严格的相等判断 ===
//   if (config.ENV_NAME === "production") {
//     return null;
//   }

//   const positionStyles: Record<Position, ViewStyle> = {
//     "top-right": { top: 10, right: 10 },
//     "top-left": { top: 10, left: 10 },
//     "bottom-right": { bottom: 10, right: 10 },
//     "bottom-left": { bottom: 10, left: 10 },
//   };

//   const envColorMap = {
//     staging: "#FFA500",
//     qa: "#4287f5",
//     production: "#4CAF50",
//   } as const;

//   const backgroundColor =
//     envColorMap[config.ENV_NAME as keyof typeof envColorMap];

//   const containerStyle: ViewStyle[] = [
//     styles.container,
//     positionStyles[position],
//     { backgroundColor },
//     style,
//   ].filter(Boolean) as ViewStyle[];

//   return (
//     <View style={containerStyle}>
//       <Text style={[styles.text, textStyle]}>
//         {config.ENV_NAME.toUpperCase()}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     opacity: 0.8,
//     zIndex: 999,
//   },
//   text: {
//     color: "white",
//     fontSize: 10,
//     fontWeight: "bold",
//   },
// });

// export default EnvIndicator;
