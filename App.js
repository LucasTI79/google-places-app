import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import Geolocation from '@react-native-community/geolocation';
import { Container, Header, Content, Button, Text, Icon, Body,Title, Left, Right  } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const App = () => {

  const [place, setPlace] = React.useState({
    latitude: -23.5505199,
    longitude: -46.63330939999999,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  const [ markerPosition, setMarkerPosition] = React.useState({
    latitude: null,
    longitude: null,
  })

  const callLocation = () => {
    if(Platform.OS === 'ios') {
      getLocation();
    } else {
      const requestLocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Acesso à Localização",
            message: "Este aplicativo precisa acessar sua localização.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          alert('Permissão de Localização negada');
        }
      };
      requestLocationPermission();
    }
  }
  
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setPlace({
          ...place,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        setMarkerPosition({
          ...markerPosition,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  const openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal({useOverlay:true})
    .then((place) => {
    setPlace({
      latitude: place.location.latitude,
      longitude:place.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
    setMarkerPosition({
      ...markerPosition,
      latitude: place.location.latitude,
      longitude: place.location.longitude
    })
    console.log(place)
    })
    .catch(error => console.log(error.message)); 
    }  
    
    return (
      <Container style={{flex:1}}>
        
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE} 
          region={place}
          onPress={e => {
            setMarkerPosition({
              ...markerPosition,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })}}
          onRegionChangeComplete={e => {
            setPlace({
              ...place,
              latitude: e.latitude,
              longitude: e.longitude,
              latitudeDelta: e.latitudeDelta,
              longitudeDelta: e.longitudeDelta
            })}
          }
          showsPointsOfInterest = {true}
          showsCompass = {true}
         >

          { markerPosition.latitude && (
             <Marker
             coordinate={{ latitude: markerPosition.latitude, longitude: markerPosition.longitude }} />
          )}

         
         </MapView>
        
        <Header style={{margin:8, backgroundColor:'white'}}>
          <Body>
            <Text numberOfLines={1} style={{color:'#acbcbb', fontSize:14}} onPress={openSearchModal}>
              {place.name ? place.name :'Press to pick a place'}
            </Text>
          </Body>  
            <Right>
              <Button transparent onPress={openSearchModal}>
              <Icon name='search' style={{color:'#4f6162'}}/>
              </Button>
              <Button transparent onPress={callLocation}>
              <Icon name='navigate' style={{color:'#4f6162'}}/>
              </Button>
            </Right>
        </Header>
        
        
       
    </Container>
    );
  }

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;