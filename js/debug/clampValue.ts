function clampValue(value: number, minValue: number, maxValue: number) {
    return Math.max(minValue, Math.min(maxValue, value));
}