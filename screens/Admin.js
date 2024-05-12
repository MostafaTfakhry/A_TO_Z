import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { router } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Admin() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchData = async () => {
        const usersRef = collection(db, 'Products');
        const querySnapshot = await getDocs(usersRef);
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async () => {
        if (name.trim() === '' || price.trim() === '' || image.trim() === '') {
            Alert.alert('Please enter product details');
            return;
        }

        try {
            await addDoc(collection(db, 'Products'), {
                name: name,
                price: parseFloat(price),
                image: image,
            });
            Alert.alert('Product added successfully');
            setName('');
            setPrice('');
            setImage('');
            setModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error adding product: ', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'Products', productId));
            Alert.alert('Product deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Error deleting product: ', error);
        }
    };

    const handleUpdateProduct = async () => {
        if (!selectedProduct || name.trim() === '' || price.trim() === '' || image.trim() === '') {
            Alert.alert('Please select a product and enter details');
            return;
        }

        try {
            const productId = selectedProduct.id;
            await updateDoc(doc(db, 'Products', productId), {
                name: name,
                price: parseFloat(price),
                image: image,
            });
            Alert.alert('Product updated successfully');
            setName('');
            setPrice('');
            setImage('');
            setModalVisible(false);
            fetchData();
        } catch (error) {
            console.error('Error updating product: ', error);
        }
    };

    const handleSignOut = async () => {
        try {
            router.replace("/account/login/login")
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setName(product.name);
        setPrice(product.price.toString());
        setImage(product.image);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <MaterialCommunityIcons name="logout" size={25} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setSelectedProduct(null);
                        setName('');
                        setPrice('');
                        setImage('');
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.buttonText}>Add Product</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedProduct ? 'Edit Product' : 'Add Product'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product price"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product image URL"
                            value={image}
                            onChangeText={setImage}
                        />
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={selectedProduct ? handleUpdateProduct : handleAddProduct}
                        >
                            <Text style={styles.buttonText}>{selectedProduct ? 'Update Product' : 'Add Product'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setSelectedProduct(null);
                                setName('');
                                setPrice('');
                                setImage('');
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <FlatList
                style={styles.productList}
                data={products}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={[styles.productItem, { width: '50%' }]}>
                        <ItemAdmin
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            onDelete={() => handleDeleteProduct(item.id)}
                            onEdit={() => openEditModal(item)}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    addButton: {
        backgroundColor: '#FFD700', // Change color to gold
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    actionButton: {
        backgroundColor: '#4CAF50', // Change color to green
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    cancelButton: {
        backgroundColor: '#A9A9A9', // Change color to dark gray
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginBottom: 10,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        minWidth: 300,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    productItem: {
        padding: 10,
        marginBottom: 10,
    },
    productList: {
        width: '100%',
    },
    signOutButton: {
        backgroundColor: "#FF6347", // Change color to tomato
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 18,
        alignSelf: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
});