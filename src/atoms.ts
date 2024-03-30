import { AtomEffect, atom } from "recoil";

const localStorageEffect: AtomEffect<any> = ({ setSelf, onSet, node }) => {
  try {
    const savedValue = localStorage.getItem(node.key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  } catch (err) {
    console.error(err);
  }
  onSet((newValue) => {
    try {
      localStorage.setItem(node.key, JSON.stringify(newValue));
    } catch (err) {
      console.error(err);
    }
  });
};

export type ColorScheme = "light" | "dark";

export const colorSchemeAtom = atom<ColorScheme>({
  key: "colorScheme",
  default: "dark",
  effects: [localStorageEffect],
});
