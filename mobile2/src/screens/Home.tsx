import { useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";

import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { firebase } from "@react-native-firebase/auth";

import { Loadiang } from "../components/Loading";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import dayjs from "dayjs";

interface SummaryProps {
    date: string;
    possibles: number;
    completed: number;
    idUser: string;
}[]

interface UserProps {
    id: string;
    name: string
}

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSize = 18*5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

export function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps[]>([])
    const [email, setEmail] = useState('')
    const [user, setUser] = useState<UserProps[]>([])
    const { navigate } = useNavigation();

    const users = firebase.auth().currentUser

    function fetchData(){

        firestore()
        .collection('user')
        .where('email', '==', email)
        .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
            const { name } = doc.data();

            return {
                id: doc.id,
                name
            }
        })
        setUser(data)

        })


        firestore().
            collection("daysCompleted")
            .where('idUser', '==', users?.uid)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { date, possibles, completed, idUser } = doc.data()

                    return {
                        id: doc.id,
                        date,
                        possibles,
                        completed,
                        idUser
                    }
                })
                setSummary(data)
            })
    }

    useFocusEffect(useCallback(() => {
        fetchData(); 
        setLoading(false)
    },[]))  
    
    if(loading){
        return <Loadiang />
    }
    
    return(
        <View className="flex-1 bg-background px-8 pt-16 ">
            
            <Header />

            <Text className="text-lg">
                {
                    users?.displayName == null ? null :
                    `Olá, ${users?.displayName}`
                }
            </Text>

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text 
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{width: DAY_SIZE}}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return(
                              
                                    <HabitDay 
                                        key={date.toISOString()}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                        date={date}
                                        amountCompleted={dayWithHabits?.completed}
                                        amountOfHabits={dayWithHabits?.possibles}
                                    />
                                )
                            })
                        }
                        
                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill}).map((_,i) => (
                                <View
                                    key={i}  
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE}}
                                />
                            ))
                        }
                    </View>
                }
            </ScrollView>

            
        </View>
    )
}