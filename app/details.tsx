import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useFonts } from "@expo-google-fonts/poppins";
import { Link } from 'expo-router';

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

export default function Page() {
  const [loaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemibold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const router = useRouter();
  const toBack = () => {
    router.push({ pathname: "/"});
  };

  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [data, setData] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (itemId) {
      fetch(`https://dewalaravel.com/api/places`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((apiResponse: ApiResponse) => {
          const item = apiResponse.data.find(item => item.id === parseInt(itemId));
          setData(item || null);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }
  }, [itemId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toBack()}>
      <Image style={styles.goBack} source={require('../assets/images/back.png')} />
      </TouchableOpacity>
      {data ? (
        <View>
          <Text style={styles.dataTitle}>{data.name}</Text>
          <Image source={{ uri: data.photo }} style={styles.image} />
          <Text style={styles.dataText}>{data.description}</Text>
          <Text style={styles.dataCategory}>{data.category.name}</Text>
        </View>
      ) : (
        <Text>No data found for item ID: {itemId}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24
  },
  goBack :{
    width: 24,
    height: 24,
  },

  dataTitle: {
    marginTop: 24,
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
    marginTop: 32,
    width: 100,
    height: 32,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingTop: 4,
    fontFamily: 'PoppinsRegular',
    fontSize: 16,
  },

  image: {
    marginVertical: 28,
    width: 344,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
  },
});
