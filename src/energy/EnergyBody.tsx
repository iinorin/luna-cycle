import React from "react";
import Svg, { Path, Rect, Defs, ClipPath } from "react-native-svg";

export default function EnergyBody({
  fillPercent,
  color,
}: {
  fillPercent: number;
  color: string;
}) {
  return (
    <Svg width={120} height={260} viewBox="0 0 120 260">
      <Defs>
        {/* Female body silhouette */}
        <ClipPath id="bodyClip">
          <Path
            d="
              M60 10
              C45 10 35 25 35 40
              C35 55 40 70 40 90
              C40 110 30 150 30 180
              C30 210 45 250 60 250
              C75 250 90 210 90 180
              C90 150 80 110 80 90
              C80 70 85 55 85 40
              C85 25 75 10 60 10
              Z
            "
          />
        </ClipPath>
      </Defs>

      {/* Fill layer */}
      <Rect
        x="0"
        y={260 - (260 * fillPercent) / 100}
        width="120"
        height={(260 * fillPercent) / 100}
        fill={color}
        opacity={0.5}
        clipPath="url(#bodyClip)"
      />

      {/* Body outline */}
      <Path
        d="
          M60 10
          C45 10 35 25 35 40
          C35 55 40 70 40 90
          C40 110 30 150 30 180
          C30 210 45 250 60 250
          C75 250 90 210 90 180
          C90 150 80 110 80 90
          C80 70 85 55 85 40
          C85 25 75 10 60 10
          Z
        "
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}
