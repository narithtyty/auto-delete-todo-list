import { useState, useEffect, useRef } from "react";

interface Item {
  id: string;
  type: "Fruit" | "Vegetable";
  name: string;
}

interface InitialItemData {
  type: "Fruit" | "Vegetable";
  name: string;
}

const initialItemsData: InitialItemData[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

const initialItems: Item[] = initialItemsData.map((item, index) => ({
  ...item,
  id: `${item.name.replace(/\\s+/g, '-')}-${index}`, // Unique ID
}));

function App() {
  const [availableItems, setAvailableItems] = useState<Item[]>(initialItems);
  const [fruits, setFruits] = useState<Item[]>([]);
  const [vegetables, setVegetables] = useState<Item[]>([]);
  const itemTimeoutRefs = useRef<Record<string, number>>({}); // Stores { itemId: timeoutId }

  // Cleanup timeouts on component unmount
  useEffect(() => {
    const timeouts = itemTimeoutRefs.current; // Capture current value
    return () => {
      Object.values(timeouts).forEach(window.clearTimeout);
    };
  }, []);

  const handleMoveToSideColumn = (clickedItem: Item) => {
    setAvailableItems((prevItems) => prevItems.filter((item) => item.id !== clickedItem.id));

    // Clear any existing timeout for this item (should not happen with unique IDs if logic is correct)
    if (itemTimeoutRefs.current[clickedItem.id]) {
      window.clearTimeout(itemTimeoutRefs.current[clickedItem.id]);
    }

    const timeoutId = window.setTimeout(() => {
      if (clickedItem.type === "Fruit") {
        setFruits((prev) => prev.filter((fruit) => fruit.id !== clickedItem.id));
      } else {
        setVegetables((prev) => prev.filter((veg) => veg.id !== clickedItem.id));
      }
      setAvailableItems((prevAvailable) => [...prevAvailable, clickedItem]);
      delete itemTimeoutRefs.current[clickedItem.id];
    }, 5000);

    itemTimeoutRefs.current[clickedItem.id] = timeoutId;

    if (clickedItem.type === "Fruit") {
      setFruits((prevFruits) => [...prevFruits, clickedItem]);
    } else {
      setVegetables((prevVegetables) => [...prevVegetables, clickedItem]);
    }
  };

  const handleReturnToAvailable = (itemToReturn: Item) => {
    if (itemTimeoutRefs.current[itemToReturn.id]) {
      window.clearTimeout(itemTimeoutRefs.current[itemToReturn.id]);
      delete itemTimeoutRefs.current[itemToReturn.id];
    }

    if (itemToReturn.type === "Fruit") {
      setFruits((prevFruits) => prevFruits.filter((fruit) => fruit.id !== itemToReturn.id));
    } else {
      setVegetables((prevVegetables) => prevVegetables.filter((veg) => veg.id !== itemToReturn.id));
    }
    setAvailableItems((prevAvailable) => [...prevAvailable, itemToReturn]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Fruit & Vegetable Sorter</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Available Items</h2>
            <div className="space-y-3">
              {availableItems.length === 0 ? (
                <p className="text-gray-500 text-center">No items left to sort!</p>
              ) : (
                availableItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMoveToSideColumn(item)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition transform hover:scale-105 active:scale-95"
                  >
                    {item.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-inner border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">Fruit</h2>
            <div className="space-y-3">
              {fruits.length === 0 ? (
                <p className="text-gray-500 text-center">Click items to add fruits here.</p>
              ) : (
                fruits.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleReturnToAvailable(item)}
                    className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-md shadow-sm border border-green-300 flex items-center justify-center cursor-pointer hover:bg-green-200 transition"
                  >
                    {item.name}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg shadow-inner border border-red-200">
            <h2 className="text-xl font-semibold text-red-700 mb-4 text-center">Vegetable</h2>
            <div className="space-y-3">
              {vegetables.length === 0 ? (
                <p className="text-gray-500 text-center">Click items to add vegetables here.</p>
              ) : (
                vegetables.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleReturnToAvailable(item)}
                    className="w-full py-3 px-4 bg-red-100 text-red-800 rounded-md shadow-sm border border-red-300 flex items-center justify-center cursor-pointer hover:bg-red-200 transition"
                  >
                    {item.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
