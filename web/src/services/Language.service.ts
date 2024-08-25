export function getLangNameFromIsoCode(isoCode: string) {
  const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
  return languageNames.of(isoCode);
}
