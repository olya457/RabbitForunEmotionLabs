import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { usePalette } from '../../theme/ThemeContext';
import { fs } from '../../utils/responsive';
import { FontWeight } from '../../theme/spacing';

interface DayPoint {
  label: string;
  average: number;
  count: number;
}

interface Props {
  data: DayPoint[];
  height?: number;
}

export function MoodChart({ data, height = 180 }: Props) {
  const palette = usePalette();

  const padLeft = 28;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 28;

  const chartHeight = height - padTop - padBottom;
  const maxY = 5;
  const minY = 0;

  return (
    <View style={styles.wrap}>
      <ChartBody
        data={data}
        padLeft={padLeft}
        padRight={padRight}
        padTop={padTop}
        padBottom={padBottom}
        chartHeight={chartHeight}
        height={height}
        maxY={maxY}
        minY={minY}
        palette={palette}
      />
      {data.length === 0 ? (
        <Text style={[styles.empty, { color: palette.textSecondary, fontSize: fs(12) }]}>
          No data yet
        </Text>
      ) : null}
    </View>
  );
}

interface ChartBodyProps {
  data: DayPoint[];
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  chartHeight: number;
  height: number;
  maxY: number;
  minY: number;
  palette: ReturnType<typeof usePalette>;
}

function ChartBody({
  data,
  padLeft,
  padRight,
  padTop,
  padBottom,
  chartHeight,
  height,
  maxY,
  minY,
  palette,
}: ChartBodyProps) {
  return (
    <View
      style={[
        styles.inner,
        { height },
      ]}
      onLayout={() => {}}
    >
      <AutoSizeSvg
        padLeft={padLeft}
        padRight={padRight}
        padTop={padTop}
        padBottom={padBottom}
        chartHeight={chartHeight}
        height={height}
        data={data}
        maxY={maxY}
        minY={minY}
        palette={palette}
      />
    </View>
  );
}

interface AutoSizeSvgProps extends ChartBodyProps {}

function AutoSizeSvg({
  padLeft,
  padRight,
  padTop,
  padBottom,
  chartHeight,
  height,
  data,
  maxY,
  minY,
  palette,
}: AutoSizeSvgProps) {
  const [w, setW] = React.useState(0);

  return (
    <View
      style={{ flex: 1, width: '100%' }}
      onLayout={e => setW(e.nativeEvent.layout.width)}
    >
      {w > 0 ? (
        <Svg width={w} height={height}>
          {[1, 2, 3, 4, 5].map(level => {
            const y = padTop + chartHeight - ((level - minY) / (maxY - minY)) * chartHeight;
            return (
              <React.Fragment key={`grid-${level}`}>
                <Line
                  x1={padLeft}
                  y1={y}
                  x2={w - padRight}
                  y2={y}
                  stroke={palette.divider}
                  strokeDasharray={level === 0 ? undefined : '3 4'}
                  strokeWidth={1}
                />
                <SvgText
                  x={padLeft - 8}
                  y={y + 4}
                  fill={palette.textTertiary}
                  fontSize={10}
                  textAnchor="end"
                >
                  {level}
                </SvgText>
              </React.Fragment>
            );
          })}

          {data.length > 1 ? renderLine(data, w, padLeft, padRight, padTop, padBottom, chartHeight, maxY, minY, palette) : null}

          {data.map((d, i) => {
            const step = (w - padLeft - padRight) / Math.max(data.length - 1, 1);
            const x = padLeft + step * i;
            const y = d.count > 0
              ? padTop + chartHeight - ((d.average - minY) / (maxY - minY)) * chartHeight
              : padTop + chartHeight;
            const r = d.count > 0 ? 4 : 2.5;

            return (
              <React.Fragment key={`pt-${i}`}>
                {d.count > 0 ? (
                  <Circle cx={x} cy={y} r={r} fill={palette.pink} />
                ) : (
                  <Circle cx={x} cy={padTop + chartHeight + 8} r={r} fill={palette.textTertiary} />
                )}
                <SvgText
                  x={x}
                  y={height - 8}
                  fill={palette.textSecondary}
                  fontSize={10}
                  textAnchor="middle"
                >
                  {d.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}

function renderLine(
  data: DayPoint[],
  w: number,
  padLeft: number,
  padRight: number,
  padTop: number,
  padBottom: number,
  chartHeight: number,
  maxY: number,
  minY: number,
  palette: ReturnType<typeof usePalette>
) {
  const step = (w - padLeft - padRight) / Math.max(data.length - 1, 1);
  let d = '';

  data.forEach((point, i) => {
    if (point.count === 0) return;
    const x = padLeft + step * i;
    const y = padTop + chartHeight - ((point.average - minY) / (maxY - minY)) * chartHeight;
    d += d.length === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  if (d.length === 0) return null;

  return <Path d={d} stroke={palette.pink} strokeWidth={2.5} fill="none" />;
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  inner: {
    width: '100%',
  },
  empty: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: FontWeight.semibold as any,
  },
});
