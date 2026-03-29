export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: "hoodie" | "tee";
  price: string;
  imageFront: string;
  imageBack: string;
  url: string;
}

export const products: Product[] = [
  {
    id: "i-sacrifice",
    name: "I Sacrifice...",
    subtitle: "Femto Premium Pullover",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/i-sacrifice-front.png",
    imageBack: "/products/i-sacrifice-back.png",
    url: "https://filth-customs.creator-spring.com/listing/i-sacrifice-femto",
  },
  {
    id: "guts-red",
    name: "Conqueror Guts",
    subtitle: "RED Version",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/guts-red-front.png",
    imageBack: "/products/guts-red-back.png",
    url: "https://filth-customs.creator-spring.com/listing/conqueror-guts-red-version",
  },
  {
    id: "guts-blk",
    name: "Conqueror Guts",
    subtitle: "BLK Version",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/guts-blk-front.png",
    imageBack: "/products/guts-blk-back.png",
    url: "https://filth-customs.creator-spring.com/listing/conqueror-guts-hoodie-white",
  },
  {
    id: "revenge",
    name: "Revenge HxH",
    subtitle: "復讐",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/revenge-front.png",
    imageBack: "/products/revenge-back.png",
    url: "https://filth-customs.creator-spring.com/listing/revenge-july-2024",
  },
  {
    id: "punk",
    name: "PiNK PUNK V2",
    subtitle: "PUNKS NOT DEAD",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/punk-front.png",
    imageBack: "/products/punk-back.png",
    url: "https://filth-customs.creator-spring.com/listing/pink-punk-v2-punks-not-dead",
  },
  {
    id: "femto",
    name: "Nike Femto",
    subtitle: "Berserk Hoodie",
    category: "hoodie",
    price: "$45",
    imageFront: "/products/femto-front.png",
    imageBack: "/products/femto-back.png",
    url: "https://filth-customs.creator-spring.com/listing/f-ck-femto",
  },
];
