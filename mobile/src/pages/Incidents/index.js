import React, { useEffect, useState } from 'react'
import { View, FlatList, Image, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import logoImg from '../../assets/logo.png'
import styles from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import api from '../../services/api'

export default function Incidents() {
  const navigation = useNavigation()
  const [incidents, setIncidents] = useState([])
  const [total, setTotal] = useState(0)

  // pagination
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function loadIncidents() {
    if (loading) return

    if (total > 0 && incidents.length === total) return

    setLoading(true)

    try {
      const response = await api.get('incidents', {
        params: { page }
      })
      setIncidents([...incidents, ...response.data])
      setTotal(response.headers['x-total-count'])
      setPage(page + 1)
    } catch (error) {
      console.log("Couldn't retrieve incidents.", error)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  function navigateToDetail(incident) {
    navigation.navigate('detail', { incident })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo faça o dia de uma ONG mais feliz!
      </Text>
      <FlatList
        style={styles.incidentList}
        data={incidents}
        // showsVerticalScrollIndicator={false}
        keyExtractor={incident => String(incident.id)}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incidentItem}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}
