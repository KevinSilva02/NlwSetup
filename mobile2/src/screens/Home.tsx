import { api } from "../lib/axios";
import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";

import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { dateFormat } from "../utils/firestoreDateformat";

import { useNavigation, useFocusEffect } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loadiang } from "../components/Loading";

import dayjs from "dayjs";

interface SummaryProps {
    date: string;
    possibles: number;
    completed: number;
}[]

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSize = 18*5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length



export function Home() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps[]>([])
    const { navigate } = useNavigation();

    let teste
    let arr: { date: string; id: string; amount: number; completed: number; }[] 
    let retorno
    let dayWhitHabits: {day: string}[]
    let cont = 0
    let dayCompleted

      

    function fetchData(){
        firestore().
            collection("daysCompleted")
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { date, possibles, completed } = doc.data()

                    return {
                        id: doc.id,
                        date,
                        possibles,
                        completed
                    }
                })
                setSummary(data)
                setLoading(false)
            })
    }

    
    useFocusEffect(useCallback(() => {
        fetchData(); 
    },[]))

    return(
        <View className="flex-1 bg-background px-8 pt-16 ">
            
            <Header />

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
            </View>{
                <View>
                </View>
            }
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