import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [events, setEvents] = useState([]);
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost/get_event.php');
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date.toISOString().split('T')[0]);

      await axios.post('http://localhost/add_event.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setDate(new Date());
      fetchEvents();
      setIsAddEventVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteConfirm = (onConfirmDelete) => {
    Alert.alert('삭제', '이 아이템을 삭제하시 겠습니까?', 
    [{
      'text' : '아니오',
      'style' : 'cancel'
    },
    {
      'text' : '예',
      'onPress' : onConfirmDelete
    }])
  }

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {!isAddEventVisible ? (
        <>
          <Text style={styles.header}>일정 관리</Text>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.eventItem}>
                <View style = {{flexDirection : 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <View style = {{flexDirection: 'row'}}></View>
                  <TouchableOpacity style ={styles.deleteButton} onPress={() => DeleteConfirm(() => deleteData(item.id))}>
                    <Text style ={{color: 'white'}}>삭제</Text>
                  </TouchableOpacity>              
                </View>
                <Text style={styles.eventDescription}>{item.description}</Text>
                <Text style={styles.eventDate}>{item.date}</Text>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddEventVisible(true)}>
            <Text style={styles.addButtonText}>일정 추가</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.header}>일정 추가</Text>
          <TextInput
            style={styles.input}
            placeholder="제목"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <TextInput
            style={styles.input}
            placeholder="설명"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Button title="날짜 선택" onPress={() => setShowDatePicker(true)} />
          <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
                    <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsAddEventVisible(false)}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    
  },
    buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#999999',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 120,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#999999',
    alignItems: 'center',
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#999999',
    alignItems: 'center',
    padding: 20,
    
    marginBottom: 5,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 20,
  }
});



export default App;

          