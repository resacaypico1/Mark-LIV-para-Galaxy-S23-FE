import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function HologramOrb({ listening = false }: { listening?: boolean }) {
  const colors = useColors();
  const pulse = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: listening ? 650 : 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: listening ? 650 : 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    const rotateLoop = Animated.loop(Animated.timing(rotate, { toValue: 1, duration: 12000, easing: Easing.linear, useNativeDriver: true }));
    pulseLoop.start();
    rotateLoop.start();
    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
    };
  }, [listening, pulse, rotate]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, listening ? 1.08 : 1.02] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.42, listening ? 0.9 : 0.7] });
  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.wrap} accessible accessibilityLabel={listening ? 'Mark LIV está escuchando' : 'Mark LIV está listo'}>
      <Animated.View style={[styles.ring, { borderColor: colors.primary, opacity, transform: [{ scale }, { rotate: spin }] }]} />
      <Animated.View style={[styles.ring, styles.ringInner, { borderColor: colors.accent, opacity: opacity.interpolate({ inputRange: [0.42, 0.9], outputRange: [0.35, 0.75] }), transform: [{ scale }] }]} />
      <View style={[styles.core, { backgroundColor: colors.card, borderColor: colors.primary, shadowColor: colors.primary }]}>
        <View style={[styles.eye, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <View style={[styles.eye, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <View style={[styles.bridge, { backgroundColor: colors.accent }]} />
        <View style={[styles.mouth, { borderColor: colors.primary }]} />
      </View>
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4].map((item) => <View key={item} style={[styles.dot, { backgroundColor: item % 2 ? colors.accent : colors.primary }]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 194, height: 194, borderWidth: 1, borderRadius: 100 },
  ringInner: { width: 162, height: 162, borderStyle: 'dashed' },
  core: { width: 116, height: 116, borderWidth: 1, borderRadius: 58, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.7, shadowRadius: 24, elevation: 12 },
  eye: { position: 'absolute', top: 42, width: 12, height: 5, borderRadius: 5, shadowOpacity: 0.9, shadowRadius: 8 },
  bridge: { position: 'absolute', top: 58, width: 3, height: 18, borderRadius: 4, opacity: 0.8 },
  mouth: { position: 'absolute', bottom: 31, width: 30, height: 11, borderBottomWidth: 2, borderRadius: 15 },
  dots: { position: 'absolute', bottom: 2, flexDirection: 'row', gap: 7 },
  dot: { width: 3, height: 3, borderRadius: 2, opacity: 0.7 },
});