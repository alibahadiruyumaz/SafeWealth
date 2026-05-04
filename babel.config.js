module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // MİMARİ KARAR: Cihaz uyumluluğunu bozmamak için Reanimated plugin'i kaldırıldı.
    plugins: [],
  };
};