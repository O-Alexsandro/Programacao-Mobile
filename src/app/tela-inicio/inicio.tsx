import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  ListRenderItem,
  ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  category?: string;
  stock?: number;
}

type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MALE_CATEGORIES = ['mens-shirts', 'mens-shoes', 'mens-watches'];
const FEMALE_CATEGORIES = ['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'];

type DetailsProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

function DetailsScreen({ route, navigation }: DetailsProps) {
  const { id } = route.params; // Recupera o ID passado pela Home
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados detalhados do produto específico
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // URL solicitada no prompt
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top']}>
        <Text>Produto não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
           <Text style={{color: '#4A90E2'}}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const originalPrice = product.price / (1 - (product.discountPercentage / 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <View style={styles.detailsHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.detailsImageContainer}>
          <Image 
            source={{ uri: product.thumbnail }} 
            style={styles.detailsImage} 
            resizeMode="contain" 
          />
        </View>

        <View style={styles.detailsContent}>
          <Text style={styles.detailsTitle}>{product.title}</Text>

          <View style={styles.detailsPriceRow}>
            <Text style={styles.detailsPrice}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </Text>
            {product.discountPercentage > 0 && (
              <Text style={styles.detailsOldPrice}>
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>

          <Text style={styles.detailsDescription}>
            {product.description}
            {'\n\n'}
            <Text style={{fontWeight: 'bold'}}>Categoria:</Text> {product.category}
            {'\n'}
            <Text style={{fontWeight: 'bold'}}>Estoque:</Text> {product.stock} unidades
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// TELA HOME
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeProps) {
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (selectedGender: string) => {
    setLoading(true);
    setProducts([]); 
    const categories = selectedGender === 'male' ? MALE_CATEGORIES : FEMALE_CATEGORIES;
    
    const requests = categories.map(cat => 
      axios.get(`https://dummyjson.com/products/category/${cat}`)
    );

    try {
      const responses = await Promise.all(requests);
      const allProducts = responses.flatMap(response => response.data.products as Product[]);
      setProducts(allProducts);
    } catch (error) {
      console.error("Erro na Home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  const renderItem: ListRenderItem<Product> = ({ item }) => {
    const originalPrice = item.price / (1 - (item.discountPercentage / 100));

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('Details', { id: item.id })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.productImage} resizeMode="contain" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.productDescription} numberOfLines={4}>{item.description}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles.oldPrice}>R$ {originalPrice.toFixed(2).replace('.', ',')}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.headerTabs}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'male' && styles.activeTabButton]}
          onPress={() => setActiveTab('male')}
        >
          <Text style={[styles.tabText, activeTab === 'male' && styles.activeTabText]}>Produtos Masculinos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'female' && styles.activeTabButton]}
          onPress={() => setActiveTab('female')}
        >
          <Text style={[styles.tabText, activeTab === 'female' && styles.activeTabText]}>Produtos Femininos</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#4A90E2" /></View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab}><Ionicons name="add" size={30} color="#fff" /></TouchableOpacity>
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4A90E2" />
          <Text style={[styles.navText, { color: '#4A90E2' }]}>Início</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.navText}>Configurações</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Gerais
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  // Home
  headerTabs: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTabButton: { borderBottomColor: '#4A90E2' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#333' },
  activeTabText: { color: '#000' },
  
  // Lista & Cards
  listContainer: { padding: 10, paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flex: 1, backgroundColor: '#fff', margin: 6, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', maxWidth: (width / 2) - 20 },
  imageContainer: { height: 120, padding: 10, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: '100%' },
  cardContent: { padding: 10 },
  productTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  productDescription: { fontSize: 11, color: '#888', marginBottom: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  currentPrice: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
  
  // Navegação Inferior e FAB
  fab: { position: 'absolute', bottom: 80, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', height: 60, borderTopWidth: 1, borderTopColor: '#eee', position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 2, color: '#666' },

  // Tela Detalhes
  detailsHeader: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  detailsImageContainer: { width: '100%', height: 300, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', padding: 20 },
  detailsImage: { width: '100%', height: '100%' },
  detailsContent: { padding: 20, backgroundColor: '#fff' },
  detailsTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  detailsPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  detailsPrice: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', marginRight: 12 },
  detailsOldPrice: { fontSize: 18, color: '#777', textDecorationLine: 'line-through' },
  detailsDescription: { fontSize: 16, color: '#555', lineHeight: 24 }
});