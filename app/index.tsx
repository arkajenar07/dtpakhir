import { TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Text, View, ActivityIndicator, Image, TextInput, Animated } from 'react-native';
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'expo-router';
import { useFonts } from "@expo-google-fonts/poppins";
import { Link } from 'expo-router';
import { parseISO, format } from 'date-fns';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Place {
  id: number;
  name: string;
  slug: string;
  photo: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface PlacesResponse {
  data: Place[];
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

export default function Index() {
  function formatDate(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  }

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    router.push({ pathname: "/searchResults", params: { query: searchQuery } });
  };
  
  const [loaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const router = useRouter();
  const toDetails = (itemId: number) => {
    router.push({ pathname: "/details", params: { itemId } });
  };

  const toWebsite = (linkWeb: string) => {
    router.push({ pathname: "/website", params: { linkWeb } });
  };

  const toMerdeka = () => {
    router.push({ pathname: "/details"});
  };

  const [places, setPlaces] = useState<PlacesResponse>({ data: [] });
  const [articles, setArticles] = useState<Article[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const getPlaces = async () => {
    const response = await fetch("https://dewalaravel.com/api/places");
    const placesData: PlacesResponse = await response.json();
    setPlaces(placesData);
  };

  const getArticles = async () => {
    try {
      const response = await fetch("https://api-berita-indonesia.vercel.app/cnn/teknologi");
      const articlesData: ArticlesResponse = await response.json();
      setArticles(articlesData.data.posts);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    getPlaces();
    getArticles();
  }, []);

  if (!loaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navHead}>
        <View style={styles.logo}>
        <Image style={styles.logoMain} source={require('../assets/images/logo-main.png')}></Image>
        <Text style={styles.logoName}>INFO.ONE</Text>
        </View>
        <Text style={styles.mainName} >News App</Text>
      </View>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={handleSearch}>
          <Image style={styles.searchIcon} source={require('../assets/images/li_search.png')} />
        </TouchableOpacity>
        <TextInput
          style={styles.inputSearch}
          placeholder='Find Your Information'
          placeholderTextColor={'#BBBBBB'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.linksContainer}>
        <Link style={styles.linksHeadActivated} href="/">For You</Link>
        <Link style={styles.linksHead} href="/recent">Recent Information</Link>
        <Link style={styles.linksHead} href="/recommended">Recommendation</Link>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
      >
        {places.data.length > 0 ? (
          places.data.slice(0, 5).map((place, index) => (
            <ImageBackground
              key={place.id}
              source={{ uri: place.photo }}
              style={styles.placeContainer}
            >
              <View style={styles.placeTextContent}>
                <Text style={styles.trendingText}>TRENDING DESTINATION</Text>
                <Text style={styles.placeName}>{place.name}</Text>
                <TouchableOpacity style={styles.button} onPress={() => toDetails(place.id)}>
                  <Text style={styles.buttonText}>Preview</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ))
        ) : (
          <Text>Loading</Text>
        )}
      </Animated.ScrollView>
      <View style={styles.pagination}>
        {places.data.length > 0 && places.data.slice(0, 5).map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          const widthAnimated = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ],
            outputRange: [8, 14, 8],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationIndicator,
                { opacity, width: widthAnimated }
              ]}
            />
          );
        })}
      </View>
      <View style={styles.linksNews}>
        <Text style={styles.recentLabel}>Recent Information</Text>
        <Link style={styles.linksAll} href="/allnews">See All</Link>
      </View>
      <View>
        {articles.length > 0 ? (
          articles.slice(0, 5).map((article, index) => (
            <TouchableOpacity onPress={() => toWebsite(article.link)} key={index} style={styles.newsContainer}>
              {article.thumbnail && <Image style={styles.newsImage} source={{ uri: article.thumbnail }} />}
              <View style={styles.newsTextContainer}>
                <View>
                  <Text style={styles.newsTitle}>{article.title}</Text>
                  <Text style={styles.newsCategory}>Technology</Text>
                </View>
                <View style={styles.publisherDate}>
                  <View style={styles.publisher}>
                    <Image style={styles.publisherImage} source={require('../assets/images/cnn.png')}></Image>
                    <Text style={styles.publisherText} >CNN Indonesia</Text>
                  </View>
                  <Text style={styles.publisherText} >{ formatDate(article.pubDate)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Loading</Text>
        )}
      </View>
      {/* <View style={styles.navigationBottom}>
        <TouchableOpacity>
          <Image source={require('../assets/images/search.png')}></Image>
          <Text>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/images/search.png')}></Image>
          <Text>Explore</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },

  navHead : {
    paddingVertical: 24,
    width: 344,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo :{
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoMain:{
    width: 32,
    height: 32,
    borderRadius: 32,
  },

  logoName : {
    marginLeft: 8,
    fontFamily: 'PoppinsBold',
    color: '#4169E1',
  },

  mainName : {
    fontFamily: 'PoppinsBold',
    color: '#BBBBBB',

  },

  linksContainer: {
    marginTop: 32,
    width: 340,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  linksHeadActivated: {
    fontFamily: 'PoppinsSemibold'
  },
  linksHead: {
    fontFamily: 'PoppinsRegular'
  },
  scrollViewContent: {
    marginTop: 24,
    alignItems: 'center',
  },
  placeContainer: {
    marginHorizontal: 24,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    width: width - 48, // Subtracting padding from total width
    height: 170,
    overflow: 'hidden',
  },
  placeTextContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Semi-transparent background for text
    padding: 20,
  },
  trendingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PoppinsSemibold',
  },
  placeName: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PoppinsRegular',
  },
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 78,
    height: 24,
    marginLeft: 20,
    marginTop: 124,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  buttonText: {
    color: '#1D1B1B',
    fontFamily: 'PoppinsRegular',
    fontSize: 12,
    marginTop: 2,
  },

  pagination: {
    flexDirection: 'row',
    marginTop: 10,
  },
  paginationIndicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BBB',
    margin: 5,
  },

  linksNews: {
    width: 340,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10
  },

  recentLabel:{
    fontSize: 16,
    fontFamily: 'PoppinsSemibold',
  },

  linksAll:{
    fontSize:14,
    fontFamily: 'PoppinsRegular',
    color: '#4169E1',
    textDecorationLine: 'underline'
  },

  newsContainer: {
    width: 344, 
    height: 148, 
    borderBottomWidth: 1,
    borderColor: '#ddd',
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center'
  },

  newsTextContainer:{
    height: 124,
    marginLeft: 24,
    justifyContent: 'space-between'
  },

  newsTitle: {
    width: 180,
    textAlign: 'justify',
    fontSize: 11,
    fontFamily: 'PoppinsRegular',
  },

  newsDate: {
    width: 180,
    textAlign: 'justify',
    fontSize: 10,

    fontFamily: 'PoppinsRegular',
  },

  newsImage: {
    borderRadius: 10,
    width: 120,
    height: 120
  },

  newsCategory:{
    marginTop: 6,
    color: '#BBBBBB',
    textAlign: 'center',
    fontFamily: 'PoppinsRegular',
    padding: 2,
    paddingTop: 4,
    fontSize: 9,
    borderWidth: 0.5,
    borderColor: '#BBBBBB',
    width: 84,
    borderRadius: 12
  },
  
  publisherDate :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  publisher : {
    flexDirection: 'row',
    alignItems: 'center'
  },

  publisherImage :{
    width: 24,
    height: 24,
    borderWidth: 0.5,
    borderColor: '#BBB',
    borderRadius: 24
  },

  publisherText :{
    marginLeft: 4,
    color: '#BBBBBB',
    fontFamily: 'PoppinsRegular',
    fontSize: 10,
  }, 

  navigationBottom : {
    position: 'absolute',
  }
});
