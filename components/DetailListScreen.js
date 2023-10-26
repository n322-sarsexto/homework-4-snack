import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Appbar,
  Modal,
  TextInput,
  Button,
  List,
  IconButton,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailListScreen({navigation, route, idx}) {
  let listObj = route.params;
  const [visible, setVisible] = useState();
  const [itemName, setItemName] = useState();
  const [listItem, setListItem] = useState();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const addItem = () => {
    hideModal();
    let newListObj = { itemName: itemName };
    listObj.items.push(newListObj);
    storeData(listObj.items);
  };

  const storeData = async (itemData) => {
    try {
      const jsonVal = await AsyncStorage.getItem('savedLists');
      const parsedStoredVals = JSON.parse(jsonVal);

      for (let idx in parsedStoredVals) {
        if (parsedStoredVals[idx].name == listObj.name) {
          parsedStoredVals[idx].items = itemData;
        }

        const newJsonVal = JSON.stringify(parsedStoredVals);
        await AsyncStorage.setItem('savedLists', newJsonVal);
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  const deleteItem = (item) => {
    listObj.items = listObj.items.filter((a) => a.itemName !== item.itemName);
    setListItem(listObj.items);
  };

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.heading}>
        <Appbar.Action
          icon="keyboard-backspace"
          onPress={() => navigation.navigate('Home')}
        />
        <Appbar.Content title={listObj.name} />
        <Appbar.Action icon="plus-circle-outline" onPress={showModal} />
      </Appbar.Header>
      <View style={styles.lists}>
        {listObj.items.map((item) => (
          <List.Item
            style={styles.listItem}
            title={item.itemName}
            right={(props) => (
              <IconButton
                icon="delete"
                size={20}
                onPress={() => {
                  deleteItem(item);
                }}
              />
            )}
          />
        ))}
      </View>

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <Text style={styles.paragraph}>Add an item to the list.</Text>
        <TextInput
          label="Item name..."
          style={styles.textInput}
          onChangeText={setItemName}
          underlineColor="#A04668"
          activeUnderlineColor="#A04668"
        />
        <View style={styles.flexRow}><Button mode="contained" onPress={hideModal} style={styles.popupBtn}>Cancel</Button>
        <Button mode="contained" onPress={addItem} style={styles.popupNonBtn}>Add item</Button></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#391822',
  },
  heading: {
    backgroundColor: '#A04668',
    borderColor: '#0C1713',
    borderBottomWidth: '1px'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lists: {
    backgroundColor: '#391822',
  },
  listItem: {
    backgroundColor: '#D9D0DE',
    borderColor: '#0C1713',
    borderBottomWidth: '1px'
  },
  flexRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "2px",
    marginTop: "2px"
  },
  popupBtn: {
    backgroundColor: '#A04668',
    width: "45%"
  },
  popupNonBtn: {
    backgroundColor: '#A04668',
    width: "45%"
  }
});
