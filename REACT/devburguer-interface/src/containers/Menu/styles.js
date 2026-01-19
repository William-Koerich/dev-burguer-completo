/* Este é o mesmo código que funcionou, 
   apenas reinserindo o BottonHomeVoltar no final.
*/

import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CardProduct } from '../../components/CardProduct';

import { 
    Container, 
    Banner,
    CategoryMenu, 
    CategoryButton, 
    ProductsContainer,
    BottonHomeVoltar 
} from './styles';

export function Menu() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(search), [search]);

    useEffect(() => {
        async function loadData() {
            try {
                const [catResponse, prodResponse] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products')
                ]);

                const categoriesData = catResponse.data.categories || catResponse.data;
                const productsData = prodResponse.data.products || prodResponse.data;

                setCategories([{ id: 0, name: 'Todas' }, ...categoriesData]);
                setProducts(productsData);

                const categoryIdFromUrl = queryParams.get('categoria');
                if (categoryIdFromUrl) {
                    setActiveCategory(Number(categoryIdFromUrl));
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [queryParams]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 0) return products;
        return products.filter(product => product.category_id === activeCategory);
    }, [activeCategory, products]);

    if (loading) return <Container><h1>A carregar...</h1></Container>;

    return (
        <Container>
            <Banner>
                <h1>O MELHOR <br/> HAMBÚRGUER <br/> ESTÁ AQUI <br/>
                    <span>Este cardápio está irresistível</span>
                </h1>
            </Banner>

            <CategoryMenu>
                        {/* Reintroduzido o botão de voltar aqui em baixo */}
                    <BottonHomeVoltar onClick={() => navigate('/')}>
                        Voltar
                    </BottonHomeVoltar>
                {categories.map(category => (
                    <CategoryButton
                        key={category.id}
                        onClick={() => {
                            setActiveCategory(category.id);
                            navigate({ pathname: '/cardapio', search: `?categoria=${category.id}` }, { replace: true });
                        }}
                        $isActiveCategory={activeCategory === category.id}
                    >
                        {category.name}
                        
                    </CategoryButton>
                ))}
            </CategoryMenu>
                
            <ProductsContainer>
                {filteredProducts.map(product => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </ProductsContainer>

           
        </Container>
    );
}
