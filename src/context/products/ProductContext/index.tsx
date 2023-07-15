import {createContext, useEffect, useState} from 'react';

import {Producto, ProductsResponse} from '../../../interfaces/products';

import instance from '../../../api/cafeApi';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProducts: (categoryId: string, productName: string) => Promise<Producto>;
  updateProducts: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProducts: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: any, id: string) => Promise<void>;
};

export const ProductContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const resp = await instance.get<ProductsResponse>('/productos?limite=50');
    setProducts({...products, ...resp.data.productos});
  };

  const addProducts = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const resp = await instance.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, resp.data]);
    return resp.data;
  };

  const updateProducts = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    const resp = await instance.put<Producto>(`/productos${productId}`, {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts(
      products.map(product =>
        product._id === productId ? resp.data : product,
      ),
    );
  };

  const deleteProducts = async (id: string) => {};

  const loadProductById = async (id: string): Promise<Producto> => {
    const resp = await instance.get<Producto>(`/productos/${id}`);
    return resp.data;
  };

  const uploadImage = async (data: any, id: string) => {};

  return (
    <ProductContext.Provider
      value={{
        products,
        loadProducts,
        addProducts,
        updateProducts,
        deleteProducts,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductContext.Provider>
  );
};
