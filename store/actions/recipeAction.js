export const toggleBookmark = (id) => {
    return { type: "BOOKMARK", recipeId: id };
}

export const toggleMealTime = (id, mealTime) => {
    return { type: "MEALTIME", recipeId: id, mealTime: mealTime };
}
export const toggleEatKcals = (kcals) => {
    return { type: "EATKCAL", eatKcals: kcals};
}
// export const toggleDinner = (id) => {
//     return { type: "DINNER", recipeId: id };
// }

