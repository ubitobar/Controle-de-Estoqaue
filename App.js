import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // Definindo estados para o produto, quantidade e estoque
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stock, setStock] = useState([]);

  // Carregar o estoque do AsyncStorage ao iniciar o app
  useEffect(() => {
    loadStock();
  }, []);

  // Função para carregar os dados do AsyncStorage
  const loadStock = async () => {
    try {
      const stockData = await AsyncStorage.getItem('stock');
      if (stockData !== null) {
        setStock(JSON.parse(stockData));
      }
    } catch (error) {
      Alert.alert('Erro ao carregar o estoque');
    }
  };

  // Função para salvar os dados no AsyncStorage
  const saveStock = async (newStock) => {
    try {
      await AsyncStorage.setItem('stock', JSON.stringify(newStock));
    } catch (error) {
      Alert.alert('Erro ao salvar o estoque');
    }
  };

  // Função para adicionar um item ao estoque
  const addItemToStock = () => {
    if (product === '' || quantity === '') {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    const newItem = { product, quantity: parseInt(quantity) };
    const updatedStock = [...stock, newItem];
    setStock(updatedStock);
    saveStock(updatedStock);
    setProduct('');
    setQuantity('');
  };

  // Função para remover um item do estoque
  const deleteItem = (index) => {
    const updatedStock = stock.filter((_, i) => i !== index);
    setStock(updatedStock);
    saveStock(updatedStock);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>

      {/* Entrada de Produto */}
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={product}
        onChangeText={setProduct}
      />

      {/* Entrada de Quantidade */}
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      {/* Botão para Adicionar Item */}
      <Button title="Adicionar ao Estoque" onPress={addItemToStock} />

      {/* Lista de Itens no Estoque */}
      <FlatList
        data={stock}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>{item.product} - Quantidade: {item.quantity}</Text>
            <Button title="Remover" onPress={() => deleteItem(index)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default App;
