import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginBottom: 8,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#d8b4fe",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfCard: {
    width: "48%",
  },

  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ec4899",
    borderRadius: 10,
  },

  glassCard: {
  backgroundColor: "rgba(139, 92, 246, 0.15)", // Subtle purple tint
  borderColor: "rgba(139, 92, 246, 0.3)",
},
phaseText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#ddd6fe",
},
meta: {
  fontSize: 14,
  color: "#cbd5e1",
  lineHeight: 20,
},

rowBetween: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
trendBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(251, 113, 133, 0.15)', // Light red/rose tint
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
},
trendText: {
  color: '#fb7185',
  fontSize: 12,
  fontWeight: 'bold',
  marginLeft: 4,
},
largeValue: {
  fontSize: 24,
},

emptyText: {
  color: "#64748b", // Slate-500
  fontSize: 13,
  textAlign: "center",
  marginVertical: 40, // Gives space when there's no chart
},

chart: {
  marginVertical: 8,
  borderRadius: 16,
  paddingRight: 40, 
},

});
