async function request(path, options = {}) {
  const url = `${process.env.REACT_APP_API_ORIGIN}${path}`;
  console.log(url);
  const response = await fetch(url, options);
  return response.json();
}

// レストラン一覧取得
export async function getRestaurants(arg = {}) {
  const params = new URLSearchParams(arg);
  return request(`/restaurants?${params.toString()}`);
}

// 特定のレストランを取得
export async function getRestaurant(restaurantId) {
  return request(`/restaurants/${restaurantId}`);
}

// レストランのレビューを取得
export async function getRestaurantReviews(restaurantId, arg = {}) {
  const params = new URLSearchParams(arg);
  return request(`/restaurants/${restaurantId}/reviews?${params.toString()}`);
}
