import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';


const HomeScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [starredItems, setStarredItems] = useState([]);

  const clothesData = [
    { id: '1', name: 'T-shirt', price: 20, image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Jeans', price: 30, image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Dress', price: 40, image: 'https://via.placeholder.com/150' },
  ];

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const toggleStar = (itemId) => {
    const index = starredItems.indexOf(itemId);
    if (index !== -1) {
      const updatedStarredItems = [...starredItems];
      updatedStarredItems.splice(index, 1);
      setStarredItems(updatedStarredItems);
    } else {
      setStarredItems([...starredItems, itemId]);
    }
  };

  const handleCartPress = () => {
    try {
      router.replace("/account/cart/Cart")
    } catch (error) {
      console.log('error', error);
      setError(error.message); 
    }
  };

  const handleViewAsAdmin = () => {
    try {
      router.replace("/account/Admin/Admin")
    } catch (error) {
      console.log('error', error);
      setError(error.message); 
    }    
  };

  const renderClothesItem = ({ item }) => {
    const isStarred = starredItems.includes(item.id);
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Price: ${item.price}</Text>
        <TouchableOpacity onPress={() => addToCart(item)} style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleStar(item.id)} style={styles.starButton}>
          <Text style={[styles.starText, isStarred && styles.starActive]}>⭐</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laza</Text>
      <FlatList
        data={clothesData}
        renderItem={renderClothesItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
        <Text style={styles.cartButtonText}>Go to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleViewAsAdmin} style={styles.adminButton}>
        <Text style={styles.adminButtonText}>View as Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 100,
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  itemName: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  starButton: {
    padding: 5,
    alignSelf: 'center',
  },
  starText: {
    fontSize: 20,
    color: '#ddd',
  },
  starActive: {
    color: 'gold', // Change to your desired color
  },
  cartButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  adminButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;
