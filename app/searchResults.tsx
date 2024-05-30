import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from "@expo-google-fonts/poppins";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ItemData {
  id: number;
  name: string;
  slug: string;
  photo: string;
  description: string;
  category: Category;
}

interface ApiResponse {
  data: ItemData[];
}

interface Article {
  link: string;
  title: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

interface ArticlesResponse {
  success: boolean;
  message: string | null;
  data: {
    link: string;
    description: string;
    title: string;
    image: string;
    posts: Article[];
  };
}

export default function Page() {

  const [loaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const router = useRouter();
  const toBack = () => {
    router.push({ pathname: "/" });
  };

  const toWebsite = (linkWeb: string) => {
    router.push({ pathname: "/website", params: { linkWeb } });
  };

  const { query } = useLocalSearchParams<{ query: string }>();
  const [placesData, setPlacesData] = useState<ItemData[]>([]);
  const [articlesData, setArticlesData] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [errorPlaces, setErrorPlaces] = useState<Error | null>(null);
  const [errorArticles, setErrorArticles] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    fetch(`https://dewalaravel.com/api/categories`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((categoryResponse) => {
        setCategories(categoryResponse.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setLoadingPlaces(true);
      fetch(`https://dewalaravel.com/api/places`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then((placesResponse: ApiResponse) => {
          let placeItems = placesResponse.data.filter(item =>
            item.slug.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (selectedCategory) {
            placeItems = placeItems.filter(item => item.category.slug === selectedCategory);
          }
          setPlacesData(placeItems);
          setLoadingPlaces(false);
        })
        .catch(err => {
          setErrorPlaces(err);
          setLoadingPlaces(false);
        });
    } else {
      setPlacesData([]);
      setLoadingPlaces(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      setLoadingArticles(true);
      fetch(`https://api-berita-indonesia.vercel.app/cnn/teknologi`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then((newsResponse: ArticlesResponse) => {
          const newsItems = newsResponse.data.posts.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setArticlesData(newsItems);
          setLoadingArticles(false);
        })
        .catch(err => {
          setErrorArticles(err);
          setLoadingArticles(false);
        });
    } else {
      setArticlesData([]);
      setLoadingArticles(false);
    }
  }, [searchQuery]);

  if (loadingPlaces || loadingArticles) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (errorPlaces) {
    return <Text>Error fetching places: {errorPlaces.message}</Text>;
  }
  if (errorArticles) {
    return <Text>Error fetching articles: {errorArticles.message}</Text>;
  }

  const noResultsFound = placesData.length === 0 && articlesData.length === 0;

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={toBack}>
        <Image style={styles.goBack} source={require('../assets/images/back.png')} />
      </TouchableOpacity>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={handleSearch}>
          <Image style={styles.searchIcon} source={require('../assets/images/li_search.png')} />
        </TouchableOpacity>
        <TextInput
          style={styles.inputSearch}
          placeholder='Find Your Information'
          placeholderTextColor={'#BBBBBB'}
          value={tempSearchQuery}
          onChangeText={setTempSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item.slug && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(item.slug)}
            >
              <Text style={[styles.categoryText, selectedCategory === item.slug && styles.selectedCategoryText]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View>
        {noResultsFound ? (
          <View style={styles.noFound}>
            <Image style={styles.noFoundImage} source={require('../assets/images/404.jpg')}></Image>
            <Text style={styles.noFoundText}>No results found for {searchQuery}</Text>
          </View>
        ) : (
          <>
            {placesData.length > 0 && (
              <>
                {placesData.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text style={styles.dataTitle}>{item.name}</Text>
                    <Image source={{ uri: item.photo }} style={styles.image} />
                    <Text style={styles.dataText}>{item.description}</Text>
                    <Text style={styles.dataCategory}>{item.category.name}</Text>
                  </View>
                ))}
              </>
            )}
            {articlesData.length > 0 && (
              <>
                {articlesData.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text style={styles.dataTitle}>{item.title}</Text>
                    <Image source={{ uri: item.thumbnail }} style={styles.image} />
                    <Text style={styles.dataText}>{item.description}</Text>
                    <TouchableOpacity onPress={() => toWebsite(item.link)}>
                      <Text style={styles.dataLink}>Read more</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  noFound: {
    marginTop: 120,
    alignItems: 'center'
  },
  noFoundText: {
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: 16,
    color: '#4169E1',
  },
  noFoundImage: {
    width: 240,
    height: 240
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: '#fff',
  },
  goBack: {
    marginBottom: 24,
    width: 24,
    height: 24,
  },
  itemContainer: {
    marginVertical: 24,
  },

  dataTitle: {
    textAlign: 'center',
    color: '#4169E1',
    fontFamily: 'PoppinsBold',
    fontSize: 16,
  },
  dataText: {
    textAlign: 'justify',
    fontFamily: 'PoppinsRegular',
    fontSize: 16,
  },
  dataCategory: {
    marginTop: 8,
    width: 100,
    height: 32,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingTop: 4,
    fontFamily: 'PoppinsRegular',
    fontSize: 16,
  },
  dataLink: {
    marginTop: 8,
    textAlign: 'center',
    color: '#4169E1',
    fontFamily: 'PoppinsRegular',
    fontSize: 16,
  },
  image: {
    marginVertical: 12,
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  searchBar: {
    paddingLeft: 24,
    width: 344,
    height: 48,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  inputSearch: {
    marginLeft: 8,
    paddingTop: 2,
    width: 260,
    height: '100%',
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
  },
  categoriesContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  categoryButton: {
    marginRight: 8,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#4169E1',
  },
  categoryText: {
    paddingTop: 4,
    fontFamily: 'PoppinsRegular',
    fontSize: 11,
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
