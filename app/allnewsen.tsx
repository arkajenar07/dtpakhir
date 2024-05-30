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

  const toBack = () => {
    router.push({ pathname: "/" });
  };
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
      const response = await fetch("https://api-berita-indonesia.vercel.app/merdeka/dunia");
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
       <TouchableOpacity onPress={toBack}>
        <Image style={styles.goBack} source={require('../assets/images/back.png')} />
       </TouchableOpacity>
       <ImageBackground
        source={require('../assets/images/world-banner.jpg')}
        style={styles.headContainer}>
            <View style={styles.headTextContent}> 
                <Text style={styles.sectionText}>WORLD</Text>
                <View style={styles.publisherHead}>
                    <Image style={styles.publisherImageHead} source={require('../assets/images/merdeka.jpeg')}></Image>
                    <Text style={styles.publisherTextHead} >Merdeka.com</Text>
                </View>
            </View>
        </ImageBackground>
      <View style={styles.linksNews}>
        <Text style={styles.recentLabel}>Recent Information</Text>
      </View>
      <View>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <TouchableOpacity onPress={() => toWebsite(article.link)} key={index} style={styles.newsContainer}>
              {article.thumbnail && <Image style={styles.newsImage} source={{ uri: article.thumbnail }} />}
              <View style={styles.newsTextContainer}>
                <View>
                  <Text style={styles.newsTitle}>{article.title}</Text>
                  <Text style={styles.newsCategory}>World</Text>
                </View>
                <View style={styles.publisherDate}>
                  <View style={styles.publisher}>
                    <Image style={styles.publisherImage} source={require('../assets/images/merdeka.jpeg')}></Image>
                    <Text style={styles.publisherText} >merdeka.com</Text>
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
    paddingHorizontal: 24,
  },

  goBack: {
    marginTop: 12,
    marginBottom: 24,
    width: 24,
    height: 24,
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
  headContainer: {
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
  headTextContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Semi-transparent background for text
    padding: 20,
  },
  sectionText: {
    marginTop: 8,
    color: '#FFF',
    fontSize: 20,
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

  publisherHead : {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },

  publisherImageHead :{
    width: 36,
    height: 36,
    borderWidth: 0.5,
    borderColor: '#BBB',
    borderRadius: 24
  },

  publisherTextHead :{
    marginLeft: 8,
    color: '#FFF',
    fontFamily: 'PoppinsRegular',
    fontSize: 14,
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
