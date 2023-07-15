import {useState, useEffect} from 'react';
import instance from '../../api/cafeApi';
import {Categoria, CategoriesResponse} from '../../interfaces/products';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const resp = await instance.get<CategoriesResponse>('/categorias');
    setCategories(resp.data.categorias);
    setIsLoading(false);
  };

  return {
    isLoading,
    categories,
  };
};
