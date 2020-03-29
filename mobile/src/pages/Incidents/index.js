import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import api from '../../services/api';

import Logo from '../../assets/logo.png';
import styles from './styles';

export default function Incident() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const navigation = useNavigation();

    function navigateToDetail(incident) {
      navigation.navigate('Details', { incident });
    }

    async function loadIncidents() {
      if(loading) {
        return;
      }

      if(total > 0 && total.length === total) {
        return;
      }

      setLoading(true);
      
      const response = await api.get('incidents', {
        params: { page }
      });

      setIncidents([...incidents, ...response.data]);
      setTotal(response.headers['x-total-count']);
      setPage(page + 1);
      setLoading(false);
    }

    useEffect(() => {
      loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={Logo} />
            <Text style={styles.headerText}>
              Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
            </Text>
          </View>

          <Text style={styles.title}> Bem-Vindo! </Text>
          <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

          <FlatList 
            data={incidents}
            style={styles.incidentList}
            keyExtractor={incident => String(incident.id)}
            showsVerticalScrollIndicator={false}
            onEndReached={loadIncidents}
            onEndReachedThreshold={0.2}
            renderItem={({ item:incident }) => (
              <View style={styles.incidentList}>
                <View style={styles.incident}>
                <Text style={styles.incidentProperty}>ONG:</Text>
                <Text style={styles.incidentValue}>{incident.name}</Text>

                <Text style={styles.incidentProperty}>CASO:</Text>
                <Text style={styles.incidentValue}>{incident.title}</Text>

                <Text style={styles.incidentProperty}>VALOR:</Text>
                <Text style={styles.incidentValue}>
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'})
                       .format(incident.value)}
                </Text>

                <TouchableOpacity 
                  style={styles.detailsButton} 
                  onPress={() => navigateToDetail(incident)}
                >
                  <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                  <Feather name="arrow-right" size={16} color="#e02041"/>
                </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
    );
}