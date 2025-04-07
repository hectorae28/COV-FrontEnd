// Array of gradient combinations that look good together
const gradientCombinations = [
  "from-blue-500 to-cyan-400",
  "from-purple-600 to-indigo-500",
  "from-green-500 to-emerald-400",
  "from-pink-500 to-rose-400",
  "from-orange-500 to-yellow-400",
  "from-indigo-500 to-blue-400",
  "from-teal-500 to-green-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-purple-400",
  "from-fuchsia-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-400",
  "from-lime-500 to-green-400",
  "from-rose-500 to-red-400",
];

// Function to assign a gradient color based on index
export const getGradientColor = (index) => {
  // Use modulo to cycle through the array if there are more items than gradients
  return gradientCombinations[index % gradientCombinations.length];
};

// Timeline data with automatically assigned gradient colors
