import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
export const metadata ={
  title:'Home',
}
const HomePage = async   () => {
 const LatestProduct = await getLatestProducts();
  return ( <div>
    <ProductList data={LatestProduct} title="Newest Arrivals" />
  </div> );
}
 
export default HomePage;
