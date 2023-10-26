import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import {
  Button,
  Appbar,
  Modal,
  TextInput,
  List,
  IconButton,
  Surface,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [visible, setVisible] = useState();
  const [listName, setListName] = useState();
  const [lists, setLists] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const [noListsMessage, setNoListsMessage] = useState('');
  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  const addItem = () => {
    setLists([...lists, { name: listName, items: [] }]);
    storeData([...lists, { name: listName, items: [] }]);
    hideModal();
  };

  const storeData = async (storedLists) => {
    try {
      const jsonValue = JSON.stringify(storedLists);
      await AsyncStorage.setItem('savedLists', jsonValue);
      getData();
    } catch (e) {
      console.log('Error: ', e);
    }
  };
  const getData = async () => {
    try {
      let jsonVal = await AsyncStorage.getItem('savedLists');
      jsonVal = JSON.parse(jsonVal);
      if (!jsonVal || jsonVal.length == 0) {
        setNoListsMessage(
          'You have no lists saved. Please add a list to continue.'
        );
      } else {
        setNoListsMessage('');
        setLists(jsonVal);
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.heading}>
        <Appbar.Content title={'Listify - My Lists'} />
        <Appbar.Action icon="plus-circle-outline" onPress={showModal} />
      </Appbar.Header>

      <View style={styles.lists}>
        {noListsMessage ? (
          <Surface style={styles.surface}>
            <Text>{noListsMessage}</Text>
          </Surface>
        ) : (
          ''
        )}
        {lists.map((list, idx) => (
          <List.Item
            style={styles.listItem}
            title={list.name}
            onPress={() => navigation.navigate('DetailListScreen', list, idx)}
            right={(props) => (
              <IconButton
                onPress={() => {
                  setLists(lists.filter((a) => a.name !== list.name));
                  storeData(lists.filter((a) => a.name !== list.name));
                }}
                icon="delete"
                size={20}
              />
            )}
          />
        ))}
      </View>

      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <Text style={styles.paragraph}>Create a new list</Text>
        <TextInput
          label="List name"
          onChangeText={setListName}
          underlineColor="#A04668"
        />
        <View style={styles.flexRow}>
          <Button mode="contained" onPress={hideModal} style={styles.popupBtn}>
            Cancel
          </Button>
          <Button mode="contained" onPress={addItem} style={styles.popupNonBtn}>
            Add List
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
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
    borderBottomWidth: '1px',
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
    borderBottomWidth: '1px',
  },
  surface: {
    marginTop: 12,
    width: '80%',
    backgroundColor: '#D9D0DE',
    flex: 1,
    alignSelf: 'center',
    padding: 12,
    textAlign: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2px',
    marginTop: '2px',
  },
  popupBtn: {
    backgroundColor: '#A04668',
    width: '45%',
  },
  popupNonBtn: {
    backgroundColor: '#A04668',
    width: '45%',
  },
});
