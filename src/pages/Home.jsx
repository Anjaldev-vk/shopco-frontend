import { useEffect } from 'react';
import { useGetNewArrivalsQuery, useGetTopSellingQuery } from '../features/products/productApi';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCart } from '../features/cart/cartSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';
import { selectCurrentUser } from '../features/auth/selectors';
import HeroSection from '../components/home/HeroSection';
import NewArrivals from '../components/home/NewArrivals';
import TopSelling from '../components/home/TopSelling';

function Home() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  
  const { data: newArrivals, isLoading: loadingArrivals, error: errorArrivals } = useGetNewArrivalsQuery();
  const { data: topSelling, isLoading: loadingTopSelling, error: errorTopSelling } = useGetTopSellingQuery();

  useEffect(() => {
    // Fetch cart and wishlist if user is logged in
    if (currentUser) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [currentUser, dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <NewArrivals 
        products={newArrivals || []} 
        loading={loadingArrivals} 
        error={errorArrivals} 
      />

      <TopSelling 
        products={topSelling || []} 
        loading={loadingTopSelling} 
        error={errorTopSelling} 
      />
      
      <div className="h-10"></div>
    </div>
  );
}

export default Home;
