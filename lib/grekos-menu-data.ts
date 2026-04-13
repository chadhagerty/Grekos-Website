export type SimpleMenuItem = {
  name: string;
  price: string;
  description?: string;
  popular?: boolean;
};

export type MenuCategory = {
  title: string;
  items: SimpleMenuItem[];
};

export type PizzaPriceRow = {
  name: string;
  description?: string;
  small: string;
  medium: string;
  large: string;
  xLarge: string;
  popular?: boolean;
};

export const PIZZA_PRICE_ROWS: PizzaPriceRow[] = [
  {
    name: "Pizza Sauce & Cheese",
    small: "$13.75",
    medium: "$17.50",
    large: "$21.75",
    xLarge: "$26.25",
    popular: true,
  },
  {
    name: "One Ingredient Pizza",
    small: "$14.25",
    medium: "$18.25",
    large: "$22.75",
    xLarge: "$27.25",
  },
  {
    name: "Two Ingredients Pizza",
    small: "$14.75",
    medium: "$19.00",
    large: "$23.75",
    xLarge: "$28.25",
  },
  {
    name: "Three Ingredients Pizza",
    small: "$15.25",
    medium: "$19.75",
    large: "$24.75",
    xLarge: "$29.25",
  },
  {
    name: "Four Ingredients Pizza",
    small: "$15.75",
    medium: "$20.50",
    large: "$25.75",
    xLarge: "$30.25",
  },
  {
    name: "Grekos Special",
    description: "Pepperoni, mushroom, bacon, green pepper, onion",
    small: "$16.25",
    medium: "$21.25",
    large: "$26.75",
    xLarge: "$31.25",
    popular: true,
  },
  {
    name: "Hawaiian Pizza",
    description: "Ham and pineapple",
    small: "$14.75",
    medium: "$19.00",
    large: "$23.75",
    xLarge: "$28.25",
  },
  {
    name: "Hot Honey Pizza",
    description: "Dry cured pepperoni, spicy honey, chili flakes",
    small: "$18.00",
    medium: "$22.00",
    large: "$26.00",
    xLarge: "$30.50",
    popular: true,
  },
  {
    name: "The Canadian",
    description: "Pepperoni, bacon, mushrooms",
    small: "$15.25",
    medium: "$19.75",
    large: "$24.75",
    xLarge: "$29.25",
  },
  {
    name: "Vegetarian Pizza",
    description: "Mushroom, green peppers, onions, green olives, tomato",
    small: "$16.25",
    medium: "$21.25",
    large: "$26.75",
    xLarge: "$31.25",
  },
  {
    name: "Greek Pizza",
    description: "Green pepper, tomato, onion, black olives, feta cheese",
    small: "$16.25",
    medium: "$21.25",
    large: "$26.75",
    xLarge: "$31.25",
  },
  {
    name: "Meat Lovers Pizza",
    description: "Pepperoni, sausage, bacon, ham, ground beef",
    small: "$17.50",
    medium: "$24.00",
    large: "$29.50",
    xLarge: "$34.50",
    popular: true,
  },
];

export const PIZZA_NOTES = [
  "Additional Ingredients: Small $3.25 • Medium $4.00 • Large $4.50 • X-Large $5.50",
  "Double Cheese on any Pizza: Small $4.50 • Medium $5.25 • Large $6.50 • X-Large $7.75",
  "Additional topping choices include pepperoni, mushrooms, onion, tomato, ham, bacon, sausage, ground beef, hot peppers, pineapple, green olives, black olives, feta cheese, and green peppers.",
];

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    title: "Grekos Burgers",
    items: [
      { name: "Hamburger", price: "$8.00" },
      { name: "Cheeseburger", price: "$8.50" },
      { name: "Bacon Cheeseburger", price: "$9.00", popular: true },
      { name: "Double Hamburger", price: "$10.25" },
      { name: "Double Cheeseburger", price: "$11.25" },
      { name: "Double Bacon Cheeseburger", price: "$12.25" },
    ],
  },
  {
    title: "The Roadhouse Burgers",
    items: [
      {
        name: "Roadhouse Burger Single",
        price: "$9.25",
        description:
          "Sauteed onions, banana peppers, spicy mayo, BBQ sauce, mozza cheese and bacon",
        popular: true,
      },
      {
        name: "Roadhouse Burger Double",
        price: "$12.50",
        description:
          "Sauteed onions, banana peppers, spicy mayo, BBQ sauce, mozza cheese and bacon",
      },
    ],
  },
  {
    title: "Deep Fried",
    items: [
      { name: "French Fries", price: "$5.75" },
      { name: "Fries with Gravy", price: "$6.75" },
      { name: "Family Fries", price: "$9.25" },
      { name: "Family Fries with Gravy", price: "$10.50" },
      { name: "Small Poutine", price: "$8.25", popular: true },
      { name: "Large Poutine", price: "$10.75" },
      { name: "Small Italian Poutine", price: "$9.00" },
      { name: "Large Italian Poutine", price: "$12.25" },
      { name: "Spicy Fries", price: "$7.50" },
      {
        name: "Dilly Fries",
        price: "$14.00",
        description: "Diced dill pickles with dill seasoning, cheese & garlic ranch",
        popular: true,
      },
      { name: "Onion Rings", price: "$7.25" },
      {
        name: "Chicken Burger",
        price: "$9.00",
        description: "Served with lettuce & mayonnaise",
      },
      {
        name: "Chicken Fingers & Fries",
        price: "$14.75",
        description: "5 chicken strips with fries & plum sauce",
      },
      {
        name: "Fish & Chips",
        price: "$16.75",
        description: "3 pcs. filet of cod, with fries, lemon & tartar sauce",
      },
      { name: "Side order of Gravy", price: "$2.00" },
    ],
  },
  {
    title: "Baked Dishes",
    items: [
      {
        name: "Lasagna",
        price: "$15.50",
        description: "Served with pepperoni, mushrooms & garlic bread",
        popular: true,
      },
      { name: "Garlic Bread", price: "$5.25" },
      { name: "Garlic Bread & Cheese", price: "$7.75" },
      { name: "Garlic Bread, Cheese & Bacon", price: "$8.75" },
    ],
  },
  {
    title: "Grekos Wraps",
    items: [
      {
        name: "Chicken Caesar Wrap",
        price: "$10.75",
        description:
          "Grilled chicken, lettuce, tomato, mozzarella cheese & Caesar dressing",
      },
      {
        name: "Club Wrap",
        price: "$11.75",
        description:
          "Grilled chicken, bacon, lettuce, tomato, mozzarella cheese, choice of dressing",
      },
      {
        name: "Veggie Wrap",
        price: "$9.75",
        description:
          "Lettuce, onion, tomato, green pepper, pickles, green olives, mozzarella cheese, choice of dressing",
      },
    ],
  },
  {
    title: "Grekos Pitas",
    items: [
      {
        name: "Chicken Pita",
        price: "$11.25",
        description: "Grilled chicken, lettuce, onion, tomato & tzatziki",
      },
      {
        name: "Pork Pita",
        price: "$10.75",
        description: "Grilled pork, lettuce, onion, tomato & tzatziki",
      },
    ],
  },
  {
    title: "Submarine Sandwiches",
    items: [
      {
        name: "Assorted Sub",
        price: "$11.00",
        description: "Ham, salami, cheese, lettuce, onion, tomato, choice of dressing",
      },
      {
        name: "Club Sub",
        price: "$12.25",
        description: "Turkey, ham, bacon, cheese, lettuce, onion, tomato, choice of dressing",
      },
      {
        name: "Turkey Sub",
        price: "$11.00",
        description: "Turkey, cheese, lettuce, onion, tomato, choice of dressing",
      },
      {
        name: "Bacon Sub",
        price: "$12.25",
        description: "Bacon, cheese, lettuce, onion, tomato, choice of dressing",
      },
      {
        name: "Bacon Bundle",
        price: "$12.25",
        description: "Bacon and cheese",
      },
      {
        name: "Pizza Sub",
        price: "$12.25",
        description:
          "Pizza sauce, mozzarella cheese, pepperoni, mushrooms, onions & green peppers",
      },
    ],
  },
  {
    title: "Salads",
    items: [
      {
        name: "Greek Salad",
        price: "$10.25",
        description:
          "Romaine lettuce, cucumber, green pepper, tomato, onion, black olives, feta cheese & house dressing",
        popular: true,
      },
      { name: "Add Grilled Chicken", price: "$7.25" },
      {
        name: "Caesar Salad",
        price: "$9.75",
        description: "Romaine lettuce, croutons & caesar dressing",
      },
      { name: "Add Grilled Chicken", price: "$7.25" },
    ],
  },
  {
    title: "Chicken Wings",
    items: [
      {
        name: "Chicken Wings, 1 pound",
        price: "$17.50",
        description:
          "Mild, Medium, Hot, Honey Garlic, 40 Creek, Tangy Gold, Road House, Thai Chili",
        popular: true,
      },
    ],
  },
  {
    title: "Beverages",
    items: [
      { name: "Canned Drink", price: "$2.25" },
      { name: "Bottled Drink", price: "$3.50" },
      { name: "Chocolate Milk", price: "$3.75" },
    ],
  },
];

export const SAUCE_DIPS = [
  "Ranch",
  "Caesar",
  "Mayo",
  "Sub Sauce",
  "Mustard",
  "Spicy Mayo",
  "Barbecue Sauce",
  "Ketchup",
  "Creamy Garlic",
  "Chipotle Cheddar",
];
