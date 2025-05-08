// Browser-friendly food manager
const FOOD_TYPES = {
  healthy: ['تفاح', 'برتقال', 'جزر', 'خيار', 'طماطم', 'موز'],
  unhealthy: ['بيتزا', 'شيبس', 'كعكة']
};

const getFoodType = (foodName) => {
  if (FOOD_TYPES.healthy.includes(foodName)) return 'healthy';
  if (FOOD_TYPES.unhealthy.includes(foodName)) return 'unhealthy';
  return 'unknown';
};

export const getAvailableFoods = async () => {
  try {
    const response = await fetch('/images/healthy-food-sorting/foods.json');
    if (!response.ok) throw new Error('Failed to fetch foods.json');
    const foods = await response.json();
    
    // Ensure we have an array of foods with proper IDs
    const processedFoods = foods.map((food, index) => ({
      id: food.id || `food-${index + 1}`,
      name: food.name,
      type: food.type,
      image: food.image
    }));
    
    // Shuffle the array
    return processedFoods.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error('Error getting available foods:', error);
    return [];
  }
};

export const getUnusefulFoods = async () => {
  try {
    const response = await fetch('/images/healthy-unuseful/foods.json');
    if (!response.ok) throw new Error('Failed to fetch foods.json');
    let foods = await response.json();
    if (!Array.isArray(foods)) {
      if (foods && typeof foods === 'object') {
        foods = [foods];
      } else {
        foods = [];
      }
    }
    return foods.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error('Error getting unuseful foods:', error);
    return [];
  }
};

// Update food name
export const updateFoodName = (oldName, newName) => {
  try {
    // In a real application, this would update a backend or local storage
    // For now, we'll just return true to simulate success
    return true;
  } catch (error) {
    console.error('Error updating food name:', error);
    return false;
  }
};

// Update food image
export const updateFoodImage = (foodId, newImage) => {
  try {
    // Store the image in localStorage
    localStorage.setItem(`foodImage_${foodId}`, newImage);
    return true;
  } catch (error) {
    console.error('Error updating food image:', error);
    return false;
  }
};
