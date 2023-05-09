import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://34.64.171.140/readDB.php')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View>
      {data.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}
      {data.map((item) => (
        <Text key={item.id}>{item.email}</Text>
      ))}

    </View>
  );
};

export default App;