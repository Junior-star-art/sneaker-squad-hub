export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  materials: string;
  care: string;
  shipping: string;
  stock: number;
  colors: Array<{
    name: string;
    code: string;
    image: string;
  }>;
  angles: string[];
  image: string;
  releaseDate: string;
  isIconic?: boolean;
  heritage?: string;
  views?: number;
  salesVolume?: number;
  rating?: number;
  reviews?: number;
  category?: {
    sport: string;
    context: string[];
    technology: string[];
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: "$150",
    description: "The Nike Air Max 270 delivers unrivaled comfort with the largest Air unit yet.",
    features: [
      "Largest heel Air unit yet for enhanced cushioning",
      "Mesh upper for breathability",
      "Foam midsole for responsive cushioning",
      "Rubber outsole for durability"
    ],
    materials: "Upper: Mesh and synthetic materials, Midsole: Foam with Air cushioning, Outsole: Rubber",
    care: "Spot clean with mild detergent and water. Air dry away from direct heat.",
    shipping: "Free standard shipping on orders over $100",
    stock: 15,
    colors: [
      {
        name: "Black/White",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png"
      },
      {
        name: "White/Red",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png",
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png",
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9c9c5e61-d7cf-4245-a30d-c4a6c0fc0452/air-max-270-shoes-rVTfXk.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7c5678f4-c28d-4862-a8d9-56750f839f12/air-max-270-shoes-V4DfZQ.png",
    releaseDate: "2024-02-15",
    views: 1200,
    salesVolume: 85,
    category: {
      sport: "Running",
      context: ["Training", "Lifestyle"],
      technology: ["Air Max", "React"]
    }
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: "$100",
    description: "The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    features: [
      "Full-length Nike Air cushioning",
      "Padded collar for comfort",
      "Perforations on toe for breathability",
      "Durable rubber outsole"
    ],
    materials: "Upper: Leather and synthetic materials, Midsole: Nike Air cushioning, Outsole: Rubber",
    care: "Clean with a soft brush or cloth. Use mild soap if needed.",
    shipping: "Free standard shipping on orders over $100",
    stock: 20,
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/air-force-1-07-shoes-WrLlWX.png",
    releaseDate: "2024-01-15",
    isIconic: true,
    heritage: "First released in 1982, the Air Force 1 revolutionized basketball footwear.",
    views: 1500,
    salesVolume: 95,
    category: {
      sport: "Basketball",
      context: ["Lifestyle", "Street"],
      technology: ["Air"]
    }
  },
  {
    id: 3,
    name: "Nike ZoomX Vaporfly",
    price: "$250",
    description: "Continue the next evolution of speed with a racing shoe made to help you chase new goals and records. The Nike ZoomX Vaporfly 3 builds on the model racers everywhere love.",
    features: [
      "ZoomX foam for responsive cushioning",
      "Full-length carbon fiber plate",
      "Engineered mesh upper",
      "Lightweight design"
    ],
    materials: "Upper: Engineered mesh, Midsole: ZoomX foam with carbon fiber plate, Outsole: Rubber",
    care: "Hand wash with cold water and mild detergent. Air dry only.",
    shipping: "Free standard shipping on orders over $100",
    stock: 8,
    colors: [
      {
        name: "Hyper Pink",
        code: "#FF69B4",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/zoomx-vaporfly-3-road-racing-shoes-xsDgvM.png",
    releaseDate: "2024-03-01",
    views: 800,
    salesVolume: 45,
    category: {
      sport: "Running",
      context: ["Competition", "Racing"],
      technology: ["ZoomX", "Carbon Plate"]
    }
  },
  {
    id: 4,
    name: "Nike Dunk Low",
    price: "$110",
    description: "Created for the hardwood but taken to the streets, this '80s b-ball icon returns with classic details and throwback hoops flair. Channeling vintage style back onto the streets, its padded, low-cut collar lets you take your game anywhere—in comfort.",
    features: [
      "Padded, low-cut collar",
      "Classic flat laces",
      "Rubber sole for traction",
      "Perforated toe box"
    ],
    materials: "Upper: Leather and synthetic materials, Midsole: Foam, Outsole: Rubber",
    care: "Wipe clean with a dry cloth. Use shoe cleaner for tough stains.",
    shipping: "Free standard shipping on orders over $100",
    stock: 12,
    colors: [
      {
        name: "Black/White",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5939882e-c875-4ed9-a229-fe3c1c16634e/dunk-low-shoes-t4Vk4P.png",
    releaseDate: "2024-04-10",
    views: 600,
    salesVolume: 30,
    category: {
      sport: "Basketball",
      context: ["Lifestyle"],
      technology: ["Dunk"]
    }
  },
  {
    id: 5,
    name: "Nike Air Zoom Pegasus",
    price: "$120",
    description: "The Nike Air Zoom Pegasus is your trusted training companion, offering exceptional comfort and responsiveness for your daily runs. With its breathable mesh upper and Zoom Air cushioning, it delivers a smooth ride mile after mile.",
    features: [
      "Nike Zoom Air cushioning",
      "Engineered mesh upper",
      "Durable rubber outsole",
      "Dynamic Fit technology"
    ],
    materials: "Upper: Engineered mesh, Midsole: Nike Zoom Air cushioning, Outsole: Rubber",
    care: "Clean with a soft brush and mild soap. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 25,
    colors: [
      {
        name: "Blue/White",
        code: "#0000FF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/389b709e-5102-4e55-aa5d-07099b500831/pegasus-40-road-running-shoes-50CtF7.png",
    releaseDate: "2024-05-05",
    views: 500,
    salesVolume: 70,
    category: {
      sport: "Running",
      context: ["Training"],
      technology: ["Zoom Air"]
    }
  },
  {
    id: 6,
    name: "Nike Metcon 8",
    price: "$130",
    description: "The Nike Metcon 8 is built to help you tackle any workout in the gym. From lifting to sprinting to rope climbs, this training shoe delivers stability and durability.",
    features: [
      "Wide, flat heel for stability",
      "Rubber wrap-up for durability",
      "Breathable upper mesh",
      "Flexible forefoot"
    ],
    materials: "Upper: Mesh and synthetic materials, Midsole: Foam, Outsole: Rubber",
    care: "Spot clean with mild detergent. Air dry away from direct heat.",
    shipping: "Free standard shipping on orders over $100",
    stock: 18,
    colors: [
      {
        name: "Black/Red",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/metcon-8-workout-shoes-p9rQzn.png",
    releaseDate: "2024-06-20",
    views: 300,
    salesVolume: 40,
    category: {
      sport: "Training",
      context: ["CrossFit"],
      technology: ["Metcon"]
    }
  },
  {
    id: 7,
    name: "Nike Free Run 5.0",
    price: "$100",
    description: "The Nike Free Run 5.0 returns to its roots with a flexible design that moves with your foot. The lightweight upper combines with a minimal midsole for a barefoot-like feel that delivers a natural ride.",
    features: [
      "Flexible design",
      "Minimal cushioning",
      "Lightweight construction",
      "Strategic traction pattern"
    ],
    materials: "Upper: Lightweight mesh, Midsole: Foam, Outsole: Rubber pods",
    care: "Hand wash with cold water and mild soap. Air dry.",
    shipping: "Free standard shipping on orders over $100",
    stock: 30,
    colors: [
      {
        name: "Grey/White",
        code: "#808080",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b05afb11-db22-461d-b94e-49bdc316b445/free-run-5-road-running-shoes-m8L9mr.png",
    releaseDate: "2024-07-15",
    views: 400,
    salesVolume: 60,
    category: {
      sport: "Running",
      context: ["Lifestyle"],
      technology: ["Free"]
    }
  },
  {
    id: 8,
    name: "Nike React Infinity",
    price: "$160",
    description: "The Nike React Infinity is designed to help reduce injury and keep you running. More foam and improved upper details provide a secure and cushioned feel.",
    features: [
      "Nike React foam",
      "Wider forefoot base",
      "Rocker geometry",
      "Reinforced upper"
    ],
    materials: "Upper: Flyknit and synthetic materials, Midsole: Nike React foam, Outsole: Rubber",
    care: "Clean with soft brush and mild soap. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 22,
    colors: [
      {
        name: "White/Blue",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e8e530a3-2317-4783-819b-40860281daaf/invincible-3-road-running-shoes-Wwmmlp.png",
    releaseDate: "2024-08-01",
    views: 350,
    salesVolume: 50,
    category: {
      sport: "Running",
      context: ["Training"],
      technology: ["React"]
    }
  },
  {
    id: 9,
    name: "Nike Air Jordan 1",
    price: "$180",
    description: "The Air Jordan 1 is a classic basketball shoe that transcends the court. With its iconic design and premium materials, it delivers both style and comfort for everyday wear.",
    features: [
      "Premium leather upper",
      "Air-Sole cushioning",
      "Rubber cupsole",
      "Iconic Wings logo"
    ],
    materials: "Upper: Premium leather, Midsole: Air cushioning, Outsole: Rubber",
    care: "Clean with a soft brush and mild soap. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 10,
    colors: [
      {
        name: "Chicago",
        code: "#FF0000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f49d18f3-7f72-4529-9c5a-0a1f6a752613/air-jordan-1-mid-shoes-SQf7DM.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f49d18f3-7f72-4529-9c5a-0a1f6a752613/air-jordan-1-mid-shoes-SQf7DM.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f49d18f3-7f72-4529-9c5a-0a1f6a752613/air-jordan-1-mid-shoes-SQf7DM.png",
    releaseDate: "2024-09-10",
    views: 900,
    salesVolume: 75,
    category: {
      sport: "Basketball",
      context: ["Lifestyle"],
      technology: ["Air"]
    }
  },
  {
    id: 10,
    name: "Nike LeBron XXI",
    price: "$200",
    description: "The LeBron XXI is built for the next generation of basketball excellence. With its innovative cushioning system and supportive fit, it helps you perform at your best on the court.",
    features: [
      "Zoom Air cushioning",
      "Engineered upper",
      "Durable rubber outsole",
      "Dynamic fit system"
    ],
    materials: "Upper: Engineered textiles, Midsole: Zoom Air cushioning, Outsole: Rubber",
    care: "Spot clean with mild detergent. Air dry away from direct heat.",
    shipping: "Free standard shipping on orders over $100",
    stock: 15,
    colors: [
      {
        name: "Black/Gold",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/lebron-xxi-nxxt-gen-basketball-shoes-lnhK3h.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/lebron-xxi-nxxt-gen-basketball-shoes-lnhK3h.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/lebron-xxi-nxxt-gen-basketball-shoes-lnhK3h.png",
    releaseDate: "2024-10-05",
    views: 1100,
    salesVolume: 65,
    category: {
      sport: "Basketball",
      context: ["Performance"],
      technology: ["Zoom Air"]
    }
  },
  {
    id: 11,
    name: "Nike Zoom Fly 5",
    price: "$160",
    description: "The Nike Zoom Fly 5 is designed for speed and comfort during your training runs. With responsive cushioning and a streamlined design, it helps you maintain your pace mile after mile.",
    features: [
      "React foam cushioning",
      "Mesh upper for breathability",
      "Carbon fiber plate",
      "Lightweight design"
    ],
    materials: "Upper: Engineered mesh, Midsole: React foam with carbon plate, Outsole: Rubber",
    care: "Hand wash with cold water and mild detergent. Air dry only.",
    shipping: "Free standard shipping on orders over $100",
    stock: 20,
    colors: [
      {
        name: "White/Black",
        code: "#FFFFFF",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/zoom-fly-5-road-running-shoes-lnhK3h.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/zoom-fly-5-road-running-shoes-lnhK3h.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c6d47d6e-e0c8-4a18-97b6-5a26ad2d27e3/zoom-fly-5-road-running-shoes-lnhK3h.png",
    releaseDate: "2024-11-20",
    views: 700,
    salesVolume: 55,
    category: {
      sport: "Running",
      context: ["Training"],
      technology: ["React"]
    }
  },
  {
    id: 12,
    name: "Nike SB Dunk Low Pro",
    price: "$100",
    description: "The Nike SB Dunk Low Pro delivers classic skate style with modern performance features. The durable design and responsive cushioning help you push your limits on the board.",
    features: [
      "Zoom Air unit in heel",
      "Durable suede upper",
      "Padded tongue and collar",
      "Flexible rubber outsole"
    ],
    materials: "Upper: Suede and leather, Midsole: Zoom Air cushioning, Outsole: Rubber",
    care: "Clean with suede brush and specialized cleaner. Air dry naturally.",
    shipping: "Free standard shipping on orders over $100",
    stock: 8,
    colors: [
      {
        name: "Black/White",
        code: "#000000",
        image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/sb-dunk-low-pro-skate-shoes-p9rQzn.png"
      }
    ],
    angles: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/sb-dunk-low-pro-skate-shoes-p9rQzn.png"
    ],
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd88656c-0f5f-46f7-a31f-b4044187353b/sb-dunk-low-pro-skate-shoes-p9rQzn.png",
    releaseDate: "2024-12-01",
    views: 200,
    salesVolume: 20,
    category: {
      sport: "Skateboarding",
      context: ["Lifestyle"],
      technology: ["Dunk"]
    }
  }
];
